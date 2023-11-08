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
  constructor(private checkoutService: CheckoutService) {}

  @Post()
  async initiateOrder(@Body() items: CreateOrderDto) {
    return await this.checkoutService.createOrder(items);
  }

  @Post('/webhook')
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
}
