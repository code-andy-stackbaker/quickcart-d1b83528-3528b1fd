import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server';
import { MockPaymentProvider } from './integrations/payments/mock';

describe('QuickCart API', () => {
  it('GET /api/products returns the seeded catalog', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('priceCents');
  });

  it('POST /api/checkout confirms an order for a valid payload', async () => {
    const productsRes = await request(app).get('/api/products');
    const product = productsRes.body[0];

    const res = await request(app)
      .post('/api/checkout')
      .send({
        shipping: { fullName: 'Jane Doe', address: '1 Main St', city: 'Springfield', zip: '12345' },
        payment: { cardNumber: '4242424242424242', expiry: '12/30', cvc: '123' },
        items: [{ productId: product.id, quantity: 2 }]
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('confirmed');
    expect(res.body.totalCents).toBe(product.priceCents * 2);
    expect(typeof res.body.orderId).toBe('string');
  });

  it('POST /api/checkout rejects an empty cart', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({
        shipping: { fullName: 'Jane Doe', address: '1 Main St', city: 'Springfield', zip: '12345' },
        payment: { cardNumber: '4242424242424242', expiry: '12/30', cvc: '123' },
        items: []
      });

    expect(res.status).toBe(400);
  });

  it('the mock payment provider satisfies the PaymentProvider port with a successful charge', async () => {
    const provider = new MockPaymentProvider();
    const result = await provider.charge({
      amountCents: 1500,
      card: { cardNumber: '4242424242424242', expiry: '12/30', cvc: '123' }
    });

    expect(result.status).toBe('succeeded');
    expect(typeof result.transactionId).toBe('string');
  });
});
