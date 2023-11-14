import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) { }

  async getProducts(items: any) {
    return await this.prisma.products.findMany({
      where: {
        id: {
          in: items.map((item) => item.product.id),
        },
      },
    });
  }
}
