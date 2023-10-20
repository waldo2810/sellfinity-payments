import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateOrderDto } from './dto';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  private lineItems = this.stripeService.getLineItems();
  private event = this.stripeService.getEvent();

  async createOrderByProductIds(createOrderDto: CreateOrderDto) {
    const products = await this.prisma.products.findMany({
      where: {
        id: {
          in: createOrderDto.productIds,
        },
      },
    });

    products.forEach((product) => {
      this.lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'COP',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
      });
    });

    const order = await this.prisma.order.create({
      data: {
        storeId: createOrderDto.storeId,
        isPaid: false,
        orderItems: {
          create: createOrderDto.productIds.map((productId: number) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    const session = await this.stripeService.stripe.checkout.sessions.create({
      line_items: this.lineItems,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    return { session };
    // return { url: session.url }; TODO DO WHEN FRONT IS READY
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

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(', ');

    if (this.event.type === 'checkout.session.completed') {
      await this.prisma.order.update({
        where: {
          id: Number(session?.metadata?.orderId),
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || '',
        },
        include: {
          orderItems: true,
        },
      });
    }

    return { status: 200 };
  }
}
