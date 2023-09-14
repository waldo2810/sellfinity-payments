import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async createOrderByProductIds(productIds) {
    const products = await this.prisma.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return products;
  }
}
