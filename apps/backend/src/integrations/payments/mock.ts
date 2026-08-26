import type { PaymentProvider, ChargeRequest, ChargeResult } from './port';

/**
 * Deterministic, no-network mock implementation of the payment capability.
 * This is the DEFAULT provider (PAYMENT_PROVIDER unset or "mock").
 */
export class MockPaymentProvider implements PaymentProvider {
  async charge(request: ChargeRequest): Promise<ChargeResult> {
    void request;
    return {
      transactionId: `mock_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`,
      status: 'succeeded'
    };
  }
}
