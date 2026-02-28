import { useContext } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { CartContext, CartProvider } from './CartContext'

const apple = {
  id: 'apple',
  name: 'Apple',
  price: 1.25,
  reviews: [],
  inStock: true
}

const grape = {
  id: 'grape',
  name: 'Grape',
  price: 2.5,
  reviews: [],
  inStock: true
}

const CartConsumer = () => {
  const context = useContext(CartContext)

  if (!context) {
    return <div>No cart context</div>
  }

  return (
    <>
      <button onClick={() => context.addToCart(apple)}>Add apple</button>
      <button onClick={() => context.addToCart(grape)}>Add grape</button>
      <button onClick={() => context.updateQuantity('apple', 5)}>Set apple qty 5</button>
      <button onClick={() => context.updateQuantity('apple', 0)}>Set apple qty 0</button>
      <button onClick={() => context.removeFromCart('apple')}>Remove apple</button>
      <button onClick={context.clearCart}>Clear cart</button>
      <div data-testid="cart-length">{context.cartItems.length}</div>
      <div data-testid="apple-qty">
        {context.cartItems.find(item => item.id === 'apple')?.quantity ?? 0}
      </div>
    </>
  )
}

describe('CartContext', () => {
  it('provides cart context to children', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    expect(screen.getByText('Add apple')).toBeInTheDocument()
  })

  it('adds a new product to the cart', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add apple'))

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1')
    expect(screen.getByTestId('apple-qty')).toHaveTextContent('1')
  })

  it('increments quantity when adding the same product again', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add apple'))
    fireEvent.click(screen.getByText('Add apple'))

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1')
    expect(screen.getByTestId('apple-qty')).toHaveTextContent('2')
  })

  it('clears all items from the cart', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add apple'))
    fireEvent.click(screen.getByText('Add grape'))
    fireEvent.click(screen.getByText('Clear cart'))

    expect(screen.getByTestId('cart-length')).toHaveTextContent('0')
  })

  it('updates the quantity of an item in the cart', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add apple'))
    fireEvent.click(screen.getByText('Set apple qty 5'))

    expect(screen.getByTestId('apple-qty')).toHaveTextContent('5')
    expect(screen.getByTestId('cart-length')).toHaveTextContent('1')
  })

  it('removes an item from the cart when quantity is set to 0', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add apple'))
    fireEvent.click(screen.getByText('Set apple qty 0'))

    expect(screen.getByTestId('cart-length')).toHaveTextContent('0')
  })

  it('removes an item from the cart using removeFromCart', () => {
    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add apple'))
    fireEvent.click(screen.getByText('Add grape'))
    fireEvent.click(screen.getByText('Remove apple'))

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1')
    expect(screen.getByTestId('apple-qty')).toHaveTextContent('0')
  })
})