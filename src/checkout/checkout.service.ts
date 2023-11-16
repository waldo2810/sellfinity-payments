import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { MercadoPagoService } from 'src/mercadopago/mercadopago.service';
import { ProductRepository } from 'src/common/repo/product.repo';
import { OrderRepository } from 'src/common/repo/order.repo';
import { CreateOrderDto } from './dto';
import Stripe from 'stripe';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import {
  buildStripeAddress,
  buildMercadoPagoAddress,
  buildMercadoPagoPhone,
} from './utils';

type PaymentEvent = {
  action: string;
  api_version: string;
  data: { id: string };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
};

@Injectable()
export class CheckoutService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private mercadopagoService: MercadoPagoService,
    private productRepo: ProductRepository,
    private orderRepo: OrderRepository,
  ) { }

  private event = this.stripeService.getEvent();
  private payment = this.mercadopagoService.getPayment();

  async createOrder(createOrderDto: CreateOrderDto) {
    const products = await this.productRepo.getProducts(createOrderDto.items);
    this.stripeService.saveToLineItems(products);
    const order = await this.orderRepo.saveOrder(
      createOrderDto.storeId,
      createOrderDto.items,
    );
    const { url } = await this.stripeService.createCheckoutSession(
      createOrderDto.storeId,
      order.id.toString(),
    );
    return { url };
  }

  async completeOrder(payload: Buffer, signature: string) {
    try {
      this.event = this.stripeService.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
    }

    const session = this.event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    if (this.event.type === 'checkout.session.completed') {
      await this.prisma.order.update({
        where: { id: Number(session?.metadata?.orderId) },
        data: {
          isPaid: true,
          address: buildStripeAddress(address),
          email: session?.customer_details.email || '',
          phone: session?.customer_details?.phone || '',
        },
        include: { orderItems: true },
      });
    }

    return { status: 200 };
  }

  async createMercadoPagoOrder(createOrderDto: CreateOrderDto) {
    const products = await this.productRepo.getProducts(createOrderDto.items);
    const order = await this.orderRepo.saveOrder(
      createOrderDto.storeId,
      createOrderDto.items,
    );
    const preference = await this.mercadopagoService.createPreference(
      products,
      createOrderDto.storeId,
      order.id.toString(),
    );
    return { url: preference.init_point };
  }

  async completeMercadoPagoOrder(payment: PaymentEvent) {
    console.log('///////////////////////////////////////////webhook start');
    try {
      if (payment.type === 'payment') {
        const data: PaymentResponse = await this.payment.get({
          id: payment.data.id,
        });
        console.log('RETURNED PAYMENT: ', data);
        console.log('METADATA: ', data?.metadata)

        await this.prisma.order.update({
          where: {
            id: Number(data?.metadata?.order_id),
          },
          data: {
            isPaid: true,
            address: buildMercadoPagoAddress(
              data.additional_info.shipments.receiver_address,
            ),
            phone: buildMercadoPagoPhone(data?.payer?.phone) || '',
            email: data.payer.email,
          },
          include: {
            orderItems: true,
          },
        });
      }
      console.log('///////////////////////////////////////////webhook end');
      return { status: 200 };
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
    }
  }
}
