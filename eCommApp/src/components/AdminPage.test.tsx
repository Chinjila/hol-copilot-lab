import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminPage from './AdminPage'

describe('AdminPage', () => {
  it('shows no sale active by default', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    )

    expect(screen.getByText('No sale active.')).toBeInTheDocument()
  })

  it('shows validation error for non-numeric sale input', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
      target: { value: 'abc' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByText(/Invalid input/)).toBeInTheDocument()
    expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument()
  })

  it('shows sale message after valid numeric input', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
      target: { value: '15' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByText('All products are 15% off!')).toBeInTheDocument()
  })

  it('resets sale state when ending sale', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Set Sale Percent (% off for all items):'), {
      target: { value: '20' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    fireEvent.click(screen.getByRole('button', { name: 'End Sale' }))

    expect(screen.getByText('No sale active.')).toBeInTheDocument()
    expect(screen.getByLabelText('Set Sale Percent (% off for all items):')).toHaveValue('0')
  })
})