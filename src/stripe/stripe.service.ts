import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;
  private event: Stripe.Event;

  constructor(config: ConfigService) {
    this.stripe = new Stripe(config.get('STRIPE_KEY'), {
      apiVersion: '2023-08-16',
      typescript: true,
    });
  }

  public saveToLineItems(products: any) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    products.forEach((product) => {
      lineItems.push({
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
    return lineItems;
  }

  public createCheckoutSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    storeId: number,
    orderId: string,
  ) {
    console.log('///////////////////////////////////////////createCheckoutSession start');
    console.log('LINE ITEMS: ', lineItems);
    console.log('///////////////////////////////////////////createCheckoutSession end');
    const session = this.stripe.checkout.sessions.create({
      line_items: lineItems,
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
