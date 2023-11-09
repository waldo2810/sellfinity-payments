import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './orders.service';

@Controller('/orders')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @Get()
  async getOrders(@Query('storeId') storeId: number) {
    return await this.orderService.getOrders(storeId);
  }

  @Get('/sales-count')
  async getSalesCount(@Query('storeId') storeId: number) {
    return await this.orderService.getSalesCount(storeId);
  }

  @Get('/total-revenue')
  async getTotalRevenue(@Query('storeId') storeId: number) {
    return await this.orderService.getTotalRevenue(storeId);
  }

  @Get('/graph-revenue')
  async getGraphRevenue(@Query('storeId') storeId: number) {
    return await this.orderService.getGraphRevenue(storeId);
  }
}
