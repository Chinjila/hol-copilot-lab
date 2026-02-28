import { calculateTotal, formatPrice, validateEmail } from './helpers'

describe('helpers', () => {
  describe('formatPrice', () => {
    it('formats a whole number as USD currency', () => {
      expect(formatPrice(10)).toBe('$10.00')
    })

    it('formats a decimal number as USD currency', () => {
      expect(formatPrice(29.99)).toBe('$29.99')
    })
  })

  describe('calculateTotal', () => {
    it('returns 0 for an empty items list', () => {
      expect(calculateTotal([])).toBe(0)
    })

    it('calculates the total from item price and quantity', () => {
      expect(
        calculateTotal([
          { price: 2.5, quantity: 2 },
          { price: 3, quantity: 3 }
        ])
      ).toBe(14)
    })
  })

  describe('validateEmail', () => {
    it('returns true for a valid email address', () => {
      expect(validateEmail('hello@example.com')).toBe(true)
    })

    it('returns false for an invalid email address', () => {
      expect(validateEmail('not-an-email')).toBe(false)
    })
  })
})