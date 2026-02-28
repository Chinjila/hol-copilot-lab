import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an error for invalid credentials', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wrong' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'creds' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to admin and clears form for valid credentials', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(mockNavigate).toHaveBeenCalledWith('/admin')
    expect(usernameInput.value).toBe('')
    expect(passwordInput.value).toBe('')
  })
})