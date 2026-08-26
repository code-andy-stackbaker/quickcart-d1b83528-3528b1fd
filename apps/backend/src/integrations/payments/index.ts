import type { PaymentProvider } from './port';
import { MockPaymentProvider } from './mock';
import { StripePaymentProvider } from './stripe';

export type { PaymentProvider, ChargeRequest, ChargeResult } from './port';

/** Env keys required to activate the real Stripe provider. */
export const REQUIRED_ENV = ['STRIPE_SECRET_KEY'];

/**
 * The ONLY place the mock/real choice is made. Defaults to the mock
 * provider unless PAYMENT_PROVIDER=stripe and all required env keys are set.
 */
export function getPaymentProvider(): PaymentProvider {
  const providerName = process.env.PAYMENT_PROVIDER || 'mock';
  if (providerName === 'stripe' && REQUIRED_ENV.every((key) => !!process.env[key])) {
    return new StripePaymentProvider();
  }
  return new MockPaymentProvider();
}
