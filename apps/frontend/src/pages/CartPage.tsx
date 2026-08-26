import { useState, type FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { submitCheckout } from '../api/client';

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents, clearCart } = useCart();
  const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvc: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<{ orderId: string; totalCents: number } | null>(
    null
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const order = await submitCheckout({
        shipping,
        payment,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      });
      setConfirmation({ orderId: order.orderId, totalCents: order.totalCents });
      clearCart();
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setStatus('error');
    }
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-green-800">Order confirmed!</h1>
        <p className="mt-2 text-green-700">
          Thanks for shopping with QuickCart. Your order{' '}
          <span className="font-semibold">{confirmation.orderId}</span> for{' '}
          {formatPrice(confirmation.totalCents)} is on its way.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center text-neutral-500">
        Your cart is empty. Head back to the shop to add something you love.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Your cart</h1>

        <div className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-wrap items-center gap-4 p-4">
              <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
              <div className="min-w-[8rem] flex-1">
                <p className="font-medium text-neutral-900">{item.name}</p>
                <p className="text-sm text-neutral-500">{formatPrice(item.priceCents)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor={`qty-${item.productId}`} className="sr-only">
                  Quantity for {item.name}
                </label>
                <input
                  id={`qty-${item.productId}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="rounded text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                >
                  Remove
                </button>
              </div>
              <p className="w-24 text-right font-semibold text-neutral-900">
                {formatPrice(item.priceCents * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
          <span className="font-medium text-neutral-600">Order total</span>
          <span className="text-xl font-bold text-neutral-900">{formatPrice(totalCents)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="h-fit rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Checkout</h2>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-sm font-medium text-neutral-700">
              Full name
            </label>
            <input
              id="fullName"
              required
              placeholder="Jane Doe"
              value={shipping.fullName}
              onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
              className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="text-sm font-medium text-neutral-700">
              Address
            </label>
            <input
              id="address"
              required
              placeholder="1 Main St"
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium text-neutral-700">
                City
              </label>
              <input
                id="city"
                required
                placeholder="Springfield"
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="zip" className="text-sm font-medium text-neutral-700">
                ZIP code
              </label>
              <input
                id="zip"
                required
                placeholder="12345"
                value={shipping.zip}
                onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cardNumber" className="text-sm font-medium text-neutral-700">
              Card number
            </label>
            <input
              id="cardNumber"
              required
              placeholder="4242 4242 4242 4242"
              value={payment.cardNumber}
              onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
              className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="expiry" className="text-sm font-medium text-neutral-700">
                Expiry
              </label>
              <input
                id="expiry"
                required
                placeholder="12/30"
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cvc" className="text-sm font-medium text-neutral-700">
                CVC
              </label>
              <input
                id="cvc"
                required
                placeholder="123"
                value={payment.cvc}
                onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              />
            </div>
          </div>

          {status === 'error' && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-2 rounded-md bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
          >
            {status === 'submitting' ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
}
