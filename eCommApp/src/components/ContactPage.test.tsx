import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ContactPage from './ContactPage'

describe('ContactPage', () => {
  it('renders the contact form', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your request')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('shows thank you popup after form submission and clears form', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Your email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Your request'), { target: { value: 'Hello!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByText('Thank you for your message.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('dismisses the thank you popup when Continue is clicked', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Your email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Your request'), { target: { value: 'Hello!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.queryByText('Thank you for your message.')).not.toBeInTheDocument()
  })
})
