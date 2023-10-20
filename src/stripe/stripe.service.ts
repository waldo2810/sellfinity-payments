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

  public getLineItems() {
    return this.lineItems;
  }

  public getEvent() {
    return this.event;
  }
}
