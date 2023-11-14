import Stripe from 'stripe';

export function buildStripeAddress(address: Stripe.Address) {
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  return addressComponents.filter((c) => c !== null).join(', ');
}
