import { Router, type Request, type Response } from 'express';
import { getProductRepository } from './seedData';
import { getPaymentProvider } from './integrations/payments';

const router = Router();

router.get('/api/products', (_req: Request, res: Response) => {
  const repo = getProductRepository();
  res.json(repo.getAll());
});

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutRequestBody {
  shipping?: { fullName?: string; address?: string; city?: string; zip?: string };
  payment?: { cardNumber?: string; expiry?: string; cvc?: string };
  items?: CheckoutItem[];
}

router.post('/api/checkout', async (req: Request, res: Response) => {
  const body = (req.body || {}) as CheckoutRequestBody;
  const { shipping, payment, items } = body;

  if (!shipping || !payment || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Request must include shipping, payment, and at least one item' });
    return;
  }

  if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.zip) {
    res.status(400).json({ error: 'Missing required shipping details' });
    return;
  }

  if (!payment.cardNumber || !payment.expiry || !payment.cvc) {
    res.status(400).json({ error: 'Missing required payment details' });
    return;
  }

  const repo = getProductRepository();
  let totalCents = 0;

  for (const item of items) {
    const product = repo.getById(item.productId);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) {
      res.status(400).json({ error: `Invalid cart item: ${item.productId}` });
      return;
    }
    totalCents += product.priceCents * item.quantity;
  }

  try {
    const paymentProvider = getPaymentProvider();
    const result = await paymentProvider.charge({
      amountCents: totalCents,
      card: {
        cardNumber: payment.cardNumber,
        expiry: payment.expiry,
        cvc: payment.cvc
      }
    });

    res.status(201).json({
      orderId: result.transactionId,
      status: 'confirmed',
      totalCents
    });
  } catch {
    res.status(502).json({ error: 'Payment could not be processed. Please try again.' });
  }
});

export default router;
