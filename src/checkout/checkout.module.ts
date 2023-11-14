import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { StripeModule } from 'src/stripe/stripe.module';
import { MercadoPagoModule } from 'src/mercadopago/mercadopago.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductRepository } from 'src/common/repo/product.repo';
import { OrderRepository } from 'src/common/repo/order.repo';

@Module({
  imports: [StripeModule, MercadoPagoModule, OrdersModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, ProductRepository, OrderRepository],
})
export class CheckoutModule { }
