import { fireEvent, render, screen } from '@testing-library/react'
import ReviewModal from './ReviewModal'

const product = {
  id: 'apple',
  name: 'Apple',
  price: 1.25,
  inStock: true,
  reviews: [
    {
      author: 'Jane',
      comment: 'Fresh and tasty.',
      date: '2026-01-15T00:00:00.000Z'
    }
  ]
}

describe('ReviewModal', () => {
  it('returns null when no product is provided', () => {
    const { container } = render(
      <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders existing reviews for the selected product', () => {
    render(<ReviewModal product={product} onClose={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument()
    expect(screen.getByText('Fresh and tasty.')).toBeInTheDocument()
  })

  it('shows empty-state text when the product has no reviews', () => {
    render(
      <ReviewModal
        product={{ ...product, reviews: [] }}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByText('No reviews yet.')).toBeInTheDocument()
  })

  it('calls onSubmit with review data when the form is submitted', () => {
    const onSubmit = vi.fn()

    render(<ReviewModal product={{ ...product, reviews: [] }} onClose={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Sam' } })
    fireEvent.change(screen.getByPlaceholderText('Your review'), { target: { value: 'Great quality.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author: 'Sam',
        comment: 'Great quality.',
        date: expect.any(String)
      })
    )
  })

  it('closes when clicking backdrop or close button', () => {
    const onClose = vi.fn()

    const { container } = render(
      <ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />
    )

    fireEvent.click(container.querySelector('.modal-backdrop') as HTMLElement)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})