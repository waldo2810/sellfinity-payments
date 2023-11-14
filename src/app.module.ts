import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckoutModule } from './checkout/checkout.module';
import { PrismaModule } from './prisma/prisma.module';
import { StripeModule } from './stripe/stripe.module';
import { OrdersModule } from './orders/orders.module';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CheckoutModule,
    PrismaModule,
    StripeModule,
    OrdersModule,
    MercadoPagoModule
  ],
})
export class AppModule { }
