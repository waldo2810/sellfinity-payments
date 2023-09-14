import { Body, Controller, Get } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Get()
  async createOrderByProductIds(@Body() productIds: number[]) {
    return await this.checkoutService.createOrderByProductIds(productIds);
  }
}
