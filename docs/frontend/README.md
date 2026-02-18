# Frontend Documentation

This document describes the frontend architecture, page organization, localization, and build tooling based on the current repository code.

## Entry Points

- Frontend entry: `resources/js/app.tsx`
- CSS entry: `resources/css/app.css`
- Inertia boot: `resources/js/app/inertia/InertiaApp.tsx`
- Root HTML shell: `resources/views/app.blade.php`

## Inertia Rendering Model (CSR Default)

The initial Inertia page payload is embedded as JSON in the root Blade view:

- `resources/views/app.blade.php` (`<script id="inertia-page" type="application/json">...`)

The client bootstraps the Inertia app and resolves the initial page on the client:

- `resources/js/app/inertia/InertiaApp.tsx`
- Inertia SSR is disabled by default via configuration: `config/inertia.php` (env-controlled).

## Page Registry and Naming

Pages are organized under `resources/js/app/pages/*` and registered via a page registry provider:

- `resources/js/app/pages/pageRegistryProvider.ts` loads `./*/pages.ts` manifests using `import.meta.glob(..., { eager: true })`.

Each feature folder contains a `pages.ts` that registers one or more Inertia page keys, for example:

- `resources/js/app/pages/content-management/pages.ts`
- `resources/js/app/pages/dashboard/pages.ts`
- `resources/js/app/pages/auth/pages.ts`

The page keys match the strings used by backend controllers when calling `Inertia::render(...)` (e.g. `content-management/public/RenderedPage` in `app/Modules/ContentManagement/Http/Controllers/Public/PageRenderController.php`).

## Frontend Structure

At a high level, the frontend is separated into:

- `resources/js/app/`: app shell, Inertia integration, layouts, navigation, and page registry
- `resources/js/modules/`: domain-oriented feature modules and UI for admin/public sections
- `resources/js/common/`: shared utilities (including i18n and rich text)
- `resources/js/components/`: reusable UI components

### Navigation

Navigation config is defined as route-name-based nodes:

- `resources/js/config/navigation.ts`

This relies on Ziggy route metadata being provided to the frontend:

- `resources/views/app.blade.php` includes `@routes`
- Shared Ziggy props are exposed via `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

## Localization (i18n)

Backend provides localization metadata in shared Inertia props:

- `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

Frontend localization code lives under:

- `resources/js/common/i18n/` (setup, catalogs, React hooks/containers)

Build configuration intentionally keeps locale catalogs code-split by locale:

- `vite.config.js` (manual chunking for `resources/js/common/i18n/locales/*` and `resources/js/modules/**/locales/*`)

## Rich Text

The project uses Lexical-based rich text editor utilities and UI under:

- `resources/js/common/rich-text/`

## Build and Tooling

### Scripts

- Dev server: `npm run dev` (`package.json`)
- Production build: `npm run build` (runs `tsc` + Vite build) (`package.json`)
- Lint: `npm run lint` / `npm run lint:fix` (`package.json`)

### Vite

- Config: `vite.config.js`
- Laravel integration: `laravel-vite-plugin`
- React integration: `@vitejs/plugin-react`
- Tailwind integration via Vite: `@tailwindcss/vite`
- Aliases:
  - `@` -> `resources/js/` (`vite.config.js`, `tsconfig.json`)

The dev server host/port and HMR configuration can be driven via environment variables:

- `VITE_HOST`, `VITE_PORT`, `VITE_BIND` (`vite.config.js`)

### TypeScript / ESLint / Prettier

- TypeScript config: `tsconfig.json`
- ESLint config: `eslint.config.js`
- Prettier config: `.prettierrc`

### Tailwind

- Tailwind config: `tailwind.config.ts`
- PostCSS config: `postcss.config.js`

