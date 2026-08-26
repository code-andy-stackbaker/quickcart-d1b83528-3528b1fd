/**
 * Domain-typed port for the "process checkout payment" capability.
 * Both the mock and any real provider implement this exact shape so the
 * caller (routes.ts) never depends on a vendor's raw request/response shape.
 */
export interface ChargeRequest {
  amountCents: number;
  card: {
    cardNumber: string;
    expiry: string;
    cvc: string;
  };
}

export interface ChargeResult {
  transactionId: string;
  status: 'succeeded';
}

export interface PaymentProvider {
  charge(request: ChargeRequest): Promise<ChargeResult>;
}
