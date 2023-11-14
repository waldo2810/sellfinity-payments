import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) { }

  async saveOrder(storeId: number, items: any) {
    return await this.prisma.order.create({
      data: {
        storeId: storeId,
        isPaid: false,
        orderItems: {
          create: items
            .map((item) => item.product.id)
            .map((productId: number) => ({
              product: { connect: { id: productId } },
            })),
        },
      },
    });
  }
}
