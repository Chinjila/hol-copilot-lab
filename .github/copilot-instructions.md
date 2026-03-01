# GitHub Copilot Instructions

## Project Overview

**The Daily Harvest** – a React 18 + TypeScript e-commerce SPA for a grocery store, built with Vite and deployed to Azure Static Web Apps. All application code lives under `eCommApp/`.

## Architecture

```
eCommApp/src/
├── main.tsx          # Entry point – mounts BrowserRouter + App
├── App.tsx           # Route table (react-router-dom v6) + CartProvider wrapper
├── components/       # One file per page/route; shared Header & Footer imported per component
├── context/          # CartContext.tsx – sole global state (in-memory cart, no localStorage)
├── types/index.ts    # Shared interfaces: Product, Review, User, Address, CartItem
└── utils/helpers.ts  # Pure utilities: formatPrice, calculateTotal, validateEmail
```

**Data flow:** Products are loaded at runtime via `fetch('products/<name>.json')` in `ProductsPage.tsx`. There is no backend API – product data lives in `eCommApp/public/products/` as static JSON files (`apple.json`, `grapes.json`, `orange.json`, `pear.json`). Reviews added in `ReviewModal` are local state only (not persisted).

**State management:** Only `CartContext` (`context/CartContext.tsx`) is global. All other state is local `useState` inside components. `CartContext` is always required – components that consume it throw `'CartContext must be used within a CartProvider'` if rendered outside the provider.

## Developer Commands

All commands must be run from `eCommApp/`:

```bash
npm run dev           # Dev server at http://localhost:3000 (auto-opens browser)
npm run build         # tsc then vite build → dist/
npm run test          # Vitest in watch mode
npm run test:run      # Vitest single run (CI)
npm run test:coverage # Coverage report (v8) → coverage/
npm run lint          # ESLint
```

## Testing Conventions

Tests use **Vitest** (globals enabled – no explicit imports of `describe/it/expect/vi`) with **@testing-library/react**.

- **Always import `render` and other helpers from `../test/test-utils`** (not directly from `@testing-library/react`). `test-utils.tsx` wraps components with `BrowserRouter` + `CartProvider`.
- The exception: tests that need to assert on the missing-provider error (e.g. `ProductsPage.test.tsx`) render via `@testing-library/react` directly with a bare `MemoryRouter`.
- Mock `globalThis.fetch` per-test to simulate product JSON loading.
- `CartContext.Provider` can be given inline mock values when testing components that consume the cart without needing the full provider.

Example pattern from `ProductsPage.test.tsx`:
```tsx
const renderWithCartContext = (addToCart = vi.fn()) =>
  render(
    <MemoryRouter>
      <CartContext.Provider value={{ cartItems: [], addToCart, updateQuantity: vi.fn(), removeFromCart: vi.fn(), clearCart: vi.fn() }}>
        <ProductsPage />
      </CartContext.Provider>
    </MemoryRouter>
  )
```

## Key Patterns & Conventions

- **Page components** follow a fixed shell: `<div className="app"><Header /><main className="main-content">…</main><Footer /></div>`.
- **CSS class names** (e.g. `app`, `main-content`, `products-grid`, `product-card`) are defined in `App.css` / `index.css` – do not use inline styles except for one-off overrides already present in AdminPage.
- **`formatPrice`** from `utils/helpers.ts` must be used for all price display (uses `Intl.NumberFormat` with `en-US` / `USD`).
- **Product `id`** is optional in the `Product` type; use `product.id ?? product.name` as a React key.
- **Routing** is flat with no nested routes. Add new pages by: creating `src/components/NewPage.tsx`, adding a `<Route>` in `App.tsx`, and linking from `Header.tsx`.

## Adding a New Product

1. Add `<name>.json` to `eCommApp/public/products/` following the `Product` interface shape.
2. Register the filename in the `productFiles` array inside `ProductsPage.tsx`'s `loadProducts` function.

## Deployment

Azure Static Web Apps via GitHub Actions (`.github/workflows/azure-static-web-apps.yml`). App location: `eCommApp`, output: `dist`. Requires `AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret.
