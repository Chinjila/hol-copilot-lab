import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('displays a message when the cart is empty', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    // --- Negative / Edge Case: No CartProvider ---
    it('throws an error when rendered outside of CartProvider', () => {
        // Suppress console.error for expected error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<CartPage />)).toThrow('CartContext must be used within a CartProvider');
        consoleSpy.mockRestore();
    });

    // --- Checkout button visibility ---
    it('displays the checkout button when cart has items', () => {
        renderWithCartContext();
        expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
    });

    it('does not display the checkout button when the cart is empty', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
    });

    // --- Checkout modal ---
    it('does not render the checkout modal initially', () => {
        renderWithCartContext();
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('renders the checkout modal when checkout button is clicked', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    });

    it('closes the checkout modal when cancel is clicked', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('cancel-checkout'));
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    // --- Confirm checkout / order processed ---
    it('displays the order processed view after confirming checkout', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('calls clearCart when checkout is confirmed', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        expect(mockCartContext.clearCart).toHaveBeenCalledTimes(1);
    });

    it('displays processed items with correct details after checkout', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    // --- Header and Footer always rendered ---
    it('renders Header and Footer when cart has items', () => {
        renderWithCartContext();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders Header and Footer when cart is empty', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders Header and Footer on the order processed view', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    // --- Single item edge case ---
    it('displays a single cart item correctly', () => {
        const singleItemContext = {
            ...mockCartContext,
            cartItems: [mockCartItems[0]]
        };
        renderWithCartContext(singleItemContext);

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });

    // --- Image rendering ---
    it('renders product images with correct src and alt attributes', () => {
        renderWithCartContext();
        const images = screen.getAllByRole('img');

        expect(images[0]).toHaveAttribute('src', 'products/productImages/test1.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Test Product 1');
        expect(images[1]).toHaveAttribute('src', 'products/productImages/test2.jpg');
        expect(images[1]).toHaveAttribute('alt', 'Test Product 2');
    });

    it('renders product images on the order processed view', () => {
        renderWithCartContext();
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', 'products/productImages/test1.jpg');
        expect(images[1]).toHaveAttribute('src', 'products/productImages/test2.jpg');
    });

    // --- Price formatting edge case ---
    it('formats prices with two decimal places for whole-number prices', () => {
        const wholeNumberPriceContext = {
            ...mockCartContext,
            cartItems: [{
                id: '3',
                name: 'Whole Price Product',
                price: 10,
                quantity: 1,
                image: 'whole.jpg',
                reviews: [],
                inStock: true
            }]
        };
        renderWithCartContext(wholeNumberPriceContext);
        expect(screen.getByText('Price: $10.00')).toBeInTheDocument();
    });

    // --- Cart title always visible ---
    it('displays "Your Cart" heading regardless of cart state', () => {
        renderWithCartContext({ ...mockCartContext, cartItems: [] });
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    // --- Multiple checkout cancel cycles ---
    it('allows opening and canceling checkout multiple times', () => {
        renderWithCartContext();

        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('cancel-checkout'));
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('cancel-checkout'));
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    // --- High quantity edge case ---
    it('displays items with high quantity values correctly', () => {
        const highQtyContext = {
            ...mockCartContext,
            cartItems: [{
                id: '4',
                name: 'Bulk Product',
                price: 1.5,
                quantity: 9999,
                image: 'bulk.jpg',
                reviews: [],
                inStock: true
            }]
        };
        renderWithCartContext(highQtyContext);
        expect(screen.getByText('Quantity: 9999')).toBeInTheDocument();
        expect(screen.getByText('Price: $1.50')).toBeInTheDocument();
    });
});
