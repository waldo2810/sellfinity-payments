import { ReceiverAddress } from "mercadopago/dist/clients/commonTypes";
import { Phone } from "mercadopago/dist/clients/payment/commonTypes";

export function buildMercadoPagoPhone(phone: Phone) {
  return `${phone.area_code} ${phone.number}`;
}

export function buildMercadoPagoAddress(address: ReceiverAddress) {
  const addressComponents = [
    address?.street_number,
    address?.street_name,
    address?.city_name,
    address?.state_name,
    address?.zip_code,
    address?.country_name,
  ];
  return addressComponents.filter((c) => c !== null).join(', ');
}
