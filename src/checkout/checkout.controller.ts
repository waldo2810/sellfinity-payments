import {
  BadRequestException,
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { CheckoutService } from './checkout.service';
import { CreateOrderDto } from './dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) { }

  @Post('/create/stripe')
  async initiateOrder(@Body() items: CreateOrderDto) {
    try {
      return await this.checkoutService.createOrder(items);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Post('/create/mercadopago')
  async initiateMercadoPagoOrder(@Body() items: CreateOrderDto) {
    // return await this.checkoutService.createOrder(items);
    try {
      return await this.checkoutService.createMercadoPagoOrder(items);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  @Post('/webhook/stripe')
  async completeOrder(
    @Req() req: RawBodyRequest<Request>,
    @Headers('Stripe-Signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const raw = req.rawBody; // returns a `Buffer`.
    return await this.checkoutService.completeOrder(raw, signature);
  }

  @Post('/webhook/mercadopago')
  async completeMercadoPagoOrder(@Body() payment: any) {
    return await this.checkoutService.completeMercadoPagoOrder(payment);
  }
}
