# The Daily Harvest

A modern TypeScript-based shopping website built with React and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the eCommApp directory:
   ```bash
   cd eCommApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
eCommApp/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## ☁️ Azure Static Web Apps Deployment (GitHub Actions)

This repository is configured to deploy `eCommApp` to Azure Static Web Apps using GitHub Actions.

### Added workflow

- Workflow file: `.github/workflows/azure-static-web-apps.yml`
- App location: `eCommApp`
- Build output: `dist`
- Triggers:
   - Push to `main` deploys production
   - Pull requests to `main` create/update preview environments
   - Closing a PR closes the preview environment

### One-time setup

1. Create an Azure Static Web App in the Azure Portal.
2. In GitHub, go to your repository: **Settings** → **Secrets and variables** → **Actions**.
3. Add this repository secret:
    - `AZURE_STATIC_WEB_APPS_API_TOKEN` = deployment token from your Static Web App.

After the secret is added, any push to `main` runs the workflow and deploys the latest build.
