import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductsPage from './ProductsPage'
import { CartContext } from '../context/CartContext'

const productsByFile = {
  'apple.json': {
    id: 'apple',
    name: 'Apple',
    price: 1.25,
    description: 'Fresh apples.',
    image: 'apple.jpg',
    reviews: [],
    inStock: true
  },
  'grapes.json': {
    id: 'grapes',
    name: 'Grapes',
    price: 2.99,
    description: 'Sweet grapes.',
    image: 'grapes.jpg',
    reviews: [],
    inStock: false
  },
  'orange.json': {
    id: 'orange',
    name: 'Orange',
    price: 1.5,
    description: 'Juicy oranges.',
    image: 'orange.jpg',
    reviews: [],
    inStock: true
  },
  'pear.json': {
    id: 'pear',
    name: 'Pear',
    price: 2.25,
    description: 'Crisp pears.',
    image: 'pear.jpg',
    reviews: [],
    inStock: true
  }
}

const renderWithCartContext = (addToCart = vi.fn()) => {
  return render(
    <MemoryRouter>
      <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
        <ProductsPage />
      </CartContext.Provider>
    </MemoryRouter>
  )
}

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws an error when rendered outside CartProvider', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <ProductsPage />
        </MemoryRouter>
      )
    ).toThrow('CartContext must be used within a CartProvider')
  })

  it('shows loading first and then renders fetched products', async () => {
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const fileName = String(input).split('/').pop() as keyof typeof productsByFile
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productsByFile[fileName])
      } as Response)
    }) as unknown as typeof fetch

    renderWithCartContext()

    expect(screen.getByText('Loading products...')).toBeInTheDocument()
    expect(await screen.findByText('Our Products')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('$1.25')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledTimes(4)
  })

  it('adds in-stock products to cart and disables out-of-stock products', async () => {
    const addToCart = vi.fn()

    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const fileName = String(input).split('/').pop() as keyof typeof productsByFile
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productsByFile[fileName])
      } as Response)
    }) as unknown as typeof fetch

    renderWithCartContext(addToCart)
    await screen.findByText('Our Products')

    fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0])

    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ name: 'Apple' }))
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled()
  })

  it('updates displayed reviews when a new review is submitted', async () => {
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const fileName = String(input).split('/').pop() as keyof typeof productsByFile
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productsByFile[fileName])
      } as Response)
    }) as unknown as typeof fetch

    renderWithCartContext()
    await screen.findByText('Our Products')

    fireEvent.click(screen.getByAltText('Apple'))
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Taylor' } })
    fireEvent.change(screen.getByPlaceholderText('Your review'), { target: { value: 'Excellent fruit.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByText('Excellent fruit.')).toBeInTheDocument()
  })

  it('handles fetch errors and exits loading state', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    global.fetch = vi.fn(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({})
      } as Response)
    }) as unknown as typeof fetch

    renderWithCartContext()

    await waitFor(() => {
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Our Products')).toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})