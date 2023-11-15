import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';

@Injectable()
export class MercadoPagoService {
  public mercadopago: any;
  private preference: Preference;
  private payment: Payment;

  constructor(config: ConfigService) {
    this.mercadopago = new MercadoPagoConfig({
      accessToken: config.get('MERCADOPAGO_ACCESS_TOKEN'),
      options: { timeout: 5000, idempotencyKey: 'abc' },
    });
    this.preference = new Preference(this.mercadopago);
    this.payment = new Payment(this.mercadopago);
  }

  public async createPreference(
    products: any,
    storeId: number,
    orderId: string,
  ) {
    const preferenceBody: PreferenceRequest = {
      items: products.map((product) => ({
        id: product.id.toString(),
        title: product.name,
        quantity: 1,
        unit_price: product.price,
      })),
      notification_url: process.env.MERCADOPAGO_NOTIFICATION_URL,
      back_urls: {
        success: `${process.env.FRONTEND_STORE_URL}/${storeId}/cart?success=1`,
        failure: `${process.env.FRONTEND_STORE_URL}/${storeId}/cart?canceled=1`,
      },
      metadata: { orderId },
    };
    return await this.preference.create({ body: preferenceBody });
  }
  public getPreference() {
    return this.preference;
  }
  public getPayment() {
    return this.payment;
  }
}
