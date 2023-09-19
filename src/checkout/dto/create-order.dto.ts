import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  storeId: number;
  @IsNotEmpty()
  productIds: number[];
}
