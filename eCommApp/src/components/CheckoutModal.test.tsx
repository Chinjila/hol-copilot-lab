import { fireEvent, render, screen } from '@testing-library/react'
import CheckoutModal from './CheckoutModal'

describe('CheckoutModal', () => {
  it('renders checkout confirmation text', () => {
    render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument()
    expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument()
  })

  it('calls onConfirm when continue checkout is clicked', () => {
    const onConfirm = vi.fn()

    render(<CheckoutModal onConfirm={onConfirm} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when return to cart is clicked', () => {
    const onCancel = vi.fn()

    render(<CheckoutModal onConfirm={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})