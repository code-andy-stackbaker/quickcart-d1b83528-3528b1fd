import { useEffect, useState } from 'react';
import { fetchProducts, type Product } from '../api/client';
import { useCart } from '../context/CartContext';

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return <div className="flex justify-center py-24 text-neutral-500">Loading products…</div>;
  }

  if (status === 'error') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        Couldn&apos;t load products. Please try again shortly.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center text-neutral-500">
        No products are available right now.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Shop the collection</h1>
      <p className="mt-2 text-neutral-500">Fresh seasonal picks, ready to ship.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h2 className="font-semibold text-neutral-900">{product.name}</h2>
              <p className="text-lg font-bold text-neutral-900">{formatPrice(product.priceCents)}</p>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    productId: product.id,
                    name: product.name,
                    priceCents: product.priceCents,
                    imageUrl: product.imageUrl
                  })
                }
                className="mt-auto rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
