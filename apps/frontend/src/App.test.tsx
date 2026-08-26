import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';

// Hermetic: mock the API seam so no network call/backend is ever needed for these tests.
vi.mock('./api/client', () => ({
  fetchProducts: vi.fn().mockResolvedValue([
    { id: 'p1', name: 'Sample Mug', priceCents: 1200, imageUrl: 'https://picsum.photos/seed/p1/400/300' }
  ]),
  submitCheckout: vi.fn().mockResolvedValue({ orderId: 'order_test_1', status: 'confirmed', totalCents: 1200 })
}));

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('QuickCart storefront', () => {
  it('renders the product catalog after loading', async () => {
    renderApp();
    expect(await screen.findByText('Sample Mug')).toBeInTheDocument();
  });

  it('adding a product updates the cart count in the header', async () => {
    renderApp();
    const addButton = await screen.findByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /cart/i })).toHaveTextContent('1');
    });
  });

  it('shows an empty-cart message when the cart has no items', async () => {
    renderApp('/cart');
    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
