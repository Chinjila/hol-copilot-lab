import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

vi.mock('./components/HomePage', () => ({
  default: () => <div>Home page content</div>
}))

vi.mock('./components/ProductsPage', () => ({
  default: () => <div>Products page content</div>
}))

vi.mock('./components/LoginPage', () => ({
  default: () => <div>Login page content</div>
}))

vi.mock('./components/AdminPage', () => ({
  default: () => <div>Admin page content</div>
}))

vi.mock('./components/CartPage', () => ({
  default: () => <div>Cart page content</div>
}))

const renderRoute = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

describe('App routing', () => {
  it('renders home route', () => {
    renderRoute('/')
    expect(screen.getByText('Home page content')).toBeInTheDocument()
  })

  it('renders products route', () => {
    renderRoute('/products')
    expect(screen.getByText('Products page content')).toBeInTheDocument()
  })

  it('renders login route', () => {
    renderRoute('/login')
    expect(screen.getByText('Login page content')).toBeInTheDocument()
  })

  it('renders admin route', () => {
    renderRoute('/admin')
    expect(screen.getByText('Admin page content')).toBeInTheDocument()
  })

  it('renders cart route', () => {
    renderRoute('/cart')
    expect(screen.getByText('Cart page content')).toBeInTheDocument()
  })
})