# The Daily Harvest — Quick Start Guide

A comprehensive guide for new developers joining this project.

---

## What Is This Project?

**The Daily Harvest** is an e-commerce web application for selling fresh fruit products online. It's also part of a **GitHub Copilot hands-on lab** (see the `Instructions/Labs/` folder for guided exercises).

The app allows customers to browse products, manage a shopping cart, check out, and leave reviews. Admins can log in and manage sale percentages.

---

## Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** (included with Node.js)
- **Git** for version control
- **VS Code** (recommended) with the GitHub Copilot extension

Verify your setup:

```bash
node --version   # Should be v18+
npm --version    # Should be v9+
git --version
```

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/Coveros/hol-copilot-lab.git
cd hol-copilot-lab

# 2. Navigate to the application directory
cd eCommApp

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser to the URL shown in the terminal (typically `http://localhost:5173`).

---

## Key Commands

| Command               | Description                                      |
|-----------------------|--------------------------------------------------|
| `npm run dev`         | Start development server with hot reload         |
| `npm run build`       | Type-check and build for production              |
| `npm run preview`     | Serve the production build locally               |
| `npm run lint`        | Run ESLint to check code quality                 |
| `npm run lint -- --fix` | Auto-fix linting issues                        |
| `npm run test`        | Run tests in watch mode                          |
| `npm run test:run`    | Run tests once (CI-friendly)                     |
| `npm run test:ui`     | Open Vitest UI in browser                        |
| `npm run test:coverage` | Run tests with code coverage report            |

---

## Project Structure

```
hol-copilot-lab/
├── Instructions/Labs/         # Copilot lab exercises (Labs 1-7)
├── eCommApp/                  # The React application
│   ├── public/
│   │   └── products/          # Static product JSON data & images
│   ├── src/
│   │   ├── components/        # React UI components
│   │   ├── context/           # Global state (CartContext)
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Helper functions
│   │   ├── test/              # Test setup and utilities
│   │   ├── App.tsx            # Root component with routing
│   │   ├── App.css            # Application styles
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── eslint.config.ts       # ESLint 9 flat config
│   ├── tsconfig.json          # TypeScript configuration
│   ├── vite.config.ts         # Vite build configuration
│   └── package.json           # Dependencies and scripts
└── README.md                  # Repository overview
```

---

## Important Files to Know

### Start here

| File | Why it matters |
|------|---------------|
| `src/App.tsx` | **Main router** — defines all page routes and wraps the app in `CartProvider` |
| `src/context/CartContext.tsx` | **Global state** — cart actions (add, remove, clear) and state shared across all components |
| `src/types/index.ts` | **Type definitions** — data shapes for products, cart items, reviews |
| `public/products/apple.json` | **Product data schema** — check one file to understand the data format for all products |

### UI Components

| File | Purpose |
|------|---------|
| `src/components/HomePage.tsx` | Landing page with navigation to products |
| `src/components/ProductsPage.tsx` | Product catalog — fetches and displays all fruit products |
| `src/components/CartPage.tsx` | Shopping cart — view items, adjust quantities, initiate checkout |
| `src/components/CheckoutModal.tsx` | Checkout confirmation dialog |
| `src/components/ReviewModal.tsx` | Product review submission and display |
| `src/components/LoginPage.tsx` | Admin login form |
| `src/components/AdminPage.tsx` | Admin dashboard for managing sale percentages |
| `src/components/Header.tsx` | Shared page header |
| `src/components/Footer.tsx` | Shared page footer |

### Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, npm scripts, project metadata |
| `tsconfig.json` | TypeScript compiler options |
| `vite.config.ts` | Vite dev server and build settings |
| `eslint.config.ts` | ESLint 9 linting rules (flat config format) |

---

## Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Landing page |
| `/products` | `ProductsPage` | Browse fruit products |
| `/cart` | `CartPage` | View and manage cart |
| `/login` | `LoginPage` | Admin authentication |
| `/admin` | `AdminPage` | Admin dashboard |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type-safe JavaScript |
| React Router | 6.x | Client-side routing |
| Vite | 4.x | Dev server and build tool |
| ESLint | 9.x | Code linting (flat config) |
| Vitest | 3.x | Unit test framework |
| React Testing Library | 16.x | Component testing |

---

## Copilot Lab Exercises

Located in `Instructions/Labs/`, these guide you through using GitHub Copilot across the SDLC:

| Lab | Topic | Copilot Feature |
|-----|-------|-----------------|
| Lab 1 | Getting Started | Setup |
| Lab 2 | Understanding the Project | Ask mode (Chat) |
| Lab 3 | Code Editing | Edit mode |
| Lab 4 | Agent Mode | Agent mode (80%+ test coverage) |
| Lab 5 | Agentic Coding | Autonomous tasks via GitHub Issues |
| Lab 6 | MCP | Model Context Protocol servers |
| Lab 7 | Customizing Copilot | Instructions and prompt files |

---

## Common Workflows

### Adding a new product

1. Create a new JSON file in `public/products/` (follow the schema in `apple.json`)
2. Add a product image to `public/products/productImages/`
3. The product will be automatically picked up by `ProductsPage.tsx`

### Writing tests

1. Create a `*.test.tsx` file next to the component (e.g., `CartPage.test.tsx`)
2. Use the test utilities from `src/test/test-utils.tsx`
3. Run `npm run test` to see results in watch mode
4. Run `npm run test:coverage` to check coverage

### Running a full check before committing

```bash
npm run lint          # Check code quality
npm run test:run      # Run all tests once
npm run build         # Verify production build
```

---

## Troubleshooting

### `npm install` fails with ERESOLVE

```bash
rm -rf node_modules package-lock.json
npm install
```

### ESLint can't find config

Ensure `eslint.config.ts` exists in the `eCommApp/` root and `jiti` is installed (`npm install --save-dev jiti`).

### Dev server won't start

```bash
npm run dev -- --host   # Try binding to all interfaces
```

### Tests fail unexpectedly

```bash
npx vitest run --reporter=verbose   # Get detailed output
```

---

## Need Help?

- Use **GitHub Copilot Chat** to ask questions about any file in the project
- Check the lab instructions in `Instructions/Labs/` for guided walkthroughs
- Run `npm run test:ui` to visually explore test results
