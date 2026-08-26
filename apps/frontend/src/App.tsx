import { Link, Route, Routes } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import { useCart } from './context/CartContext';

export default function App() {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-neutral-900">
            QuickCart
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Shop
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
            >
              Cart
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-neutral-900">
                {totalItems}
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  );
}
