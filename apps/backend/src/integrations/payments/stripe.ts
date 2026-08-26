import type { PaymentProvider, ChargeRequest, ChargeResult } from './port';

/**
 * The ONLY file that would import a real payment vendor SDK. Reads its key
 * from process.env and maps the vendor's shape to our domain types. Not
 * wired to a live Stripe call in this demo - selected only when
 * PAYMENT_PROVIDER=stripe AND STRIPE_SECRET_KEY is set (see index.ts).
 */
export class StripePaymentProvider implements PaymentProvider {
  private readonly secretKey: string;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is required to use the Stripe payment provider');
    }
    this.secretKey = key;
  }

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    void request;
    void this.secretKey;
    // Placeholder for a real Stripe PaymentIntents integration, e.g.:
    //   const stripe = new Stripe(this.secretKey);
    //   const intent = await stripe.paymentIntents.create({ amount: request.amountCents, currency: 'usd', ... });
    throw new Error('StripePaymentProvider is not wired to a live processor in this demo; use PAYMENT_PROVIDER=mock');
  }
}
