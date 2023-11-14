import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;
  private lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  private event: Stripe.Event;

  constructor(config: ConfigService) {
    this.stripe = new Stripe(config.get('STRIPE_KEY'), {
      apiVersion: '2023-08-16',
      typescript: true,
    });
  }

  public saveToLineItems(products: any) {
    products.forEach((product) => {
      this.lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'COP',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
      });
    });
  }

  public createCheckoutSession(storeId: number, orderId: string) {
    const session = this.stripe.checkout.sessions.create({
      line_items: this.lineItems,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/${storeId}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/${storeId}/cart?canceled=1`,
      metadata: {
        orderId: orderId,
      },
    });
    return session;
  }

  public getEvent() {
    return this.event;
  }
}
