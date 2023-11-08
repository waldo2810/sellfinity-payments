import { IsNotEmpty } from 'class-validator';

type CartItem = {
  colorIds: number[];
  images: any[];
  product: any;
  sizeIds: number[];
};

export class CreateOrderDto {
  @IsNotEmpty()
  storeId: number;
  @IsNotEmpty()
  items: CartItem[];
}
