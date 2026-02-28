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
})