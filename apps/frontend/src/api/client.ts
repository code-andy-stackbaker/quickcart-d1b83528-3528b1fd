/**
 * Fetch wrapper for the QuickCart backend API. Reads the backend base URL
 * from VITE_BACKEND_URL (baked in at build time), falling back to the local
 * dev URL when unset.
 */
export interface Product {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
}

export interface CheckoutPayload {
  shipping: { fullName: string; address: string; city: string; zip: string };
  payment: { cardNumber: string; expiry: string; cvc: string };
  items: { productId: string; quantity: number }[];
}

export interface OrderConfirmation {
  orderId: string;
  status: string;
  totalCents: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BACKEND_URL}/api/products`);
  return handleResponse<Product[]>(res);
}

export async function submitCheckout(payload: CheckoutPayload): Promise<OrderConfirmation> {
  const res = await fetch(`${BACKEND_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse<OrderConfirmation>(res);
}
