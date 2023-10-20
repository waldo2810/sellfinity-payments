import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getSalesCount(@Query('storeId') storeId: number) {
    try {
      const salesCount = await this.prisma.order.count({
        where: {
          storeId,
          isPaid: true,
        },
      });
      return salesCount;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }

  async getTotalRevenue(@Query('storeId') storeId: number) {
    try {
      const paidOrders = await this.prisma.order.findMany({
        where: {
          storeId,
          isPaid: true,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
          return orderSum + item.product.price;
        }, 0);
        return total + orderTotal;
      }, 0);

      return totalRevenue;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }

  async getGraphRevenue(@Query('storeId') storeId: number) {
    try {
      const paidOrders = await this.prisma.order.findMany({
        where: {
          storeId,
          isPaid: true,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      const monthlyRevenue: { [key: number]: number } = {};

      // Grouping the orders by month and summing the revenue
      for (const order of paidOrders) {
        const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
          revenueForOrder += item.product.price;
        }

        // Adding the revenue for this order to the respective month
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
      }

      // Converting the grouped data into the format expected by the graph
      const graphData  = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 },
      ];

      // Filling in the revenue data
      for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
      }

      return graphData;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }
}
