# Frontend Overview

This document is an overview of cross-cutting frontend architecture and conventions. Module-specific UI and API contracts are documented under `docs/modules/`.

## Tech stack (evidence-based)

- React + TypeScript + Vite (`package.json`, `resources/js/app.tsx`, `vite.config.js`, `tsconfig.json`)
- Inertia client adapter: `@inertiajs/react` (`package.json`, `resources/js/app/inertia/InertiaApp.tsx`)
- HTTP client: Axios (`package.json`, `resources/js/**/core/api/*.ts`)
- UI primitives: Radix-based components + Tailwind (`package.json`, `resources/css/app.css`, `tailwind.config.ts`)

## Entry points (Inertia + Vite)

- Frontend entry: `resources/js/app.tsx`
- Inertia boot: `resources/js/app/inertia/InertiaApp.tsx`
- Root HTML shell: `resources/views/app.blade.php`
- CSS entry: `resources/css/app.css`

Inertia SSR is configured via `config/inertia.php` (env-controlled). Evidence: `resources/js/app/inertia/InertiaApp.tsx`, `resources/views/app.blade.php`, `config/inertia.php`.

## Page registry (Inertia page resolution)

Inertia pages are organized under `resources/js/app/pages/*`. Each feature folder exports a `registerPages(...)` function from a `pages.ts` manifest, and the registry provider eagerly loads those manifests.

Evidence:

- Registry provider: `resources/js/app/pages/pageRegistryProvider.ts`
- Example manifests: `resources/js/app/pages/projects/pages.ts`, `resources/js/app/pages/initiatives/pages.ts`

Backend controllers render pages using the same page keys via `Inertia::render(...)`. Evidence: `app/Modules/*/Http/Controllers/*Controller.php`.

## Frontend structure (app vs modules)

- `resources/js/app/`: application shell, layouts, navigation, Inertia integration
- `resources/js/modules/`: domain-oriented feature modules (admin UI + public CMS sections)
- `resources/js/common/`: shared utilities (i18n, rich text, etc.)
- `resources/js/components/`: reusable UI primitives

Evidence: folder structure under `resources/js/`.

## Routing on the client (Ziggy)

Frontend code uses Ziggy’s `route(...)` helper and relies on Ziggy route metadata being shared by the backend:

- Blade includes Ziggy routes: `resources/views/app.blade.php` (`@routes`)
- Backend shares Ziggy props: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

## Localization (i18n)

Localization metadata (locale + supported locales) is shared to the client via the Inertia middleware, and frontend i18n code lives under `resources/js/common/i18n/`. Evidence: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`, `resources/js/common/i18n/`.

Build config keeps locale catalogs code-split by locale. Evidence: `vite.config.js`.

## Common admin UX patterns

These are patterns visible across multiple modules:

- **Overlays instead of `show` pages**: admin index pages often open a client-side overlay/modal for read-only details rather than navigating to a `*.show` route (e.g. Courses, Initiatives). Evidence: `resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/app/pages/initiatives/admin/index/page.tsx`.
- **Translations modal**: edit pages open a “Manage translations” modal that calls `{entity}.translations.*` JSON endpoints via `window.axios` + Ziggy `route(...)`. Evidence: `resources/js/modules/*/core/api/translations.ts`, `resources/js/modules/*/ui/TranslationModal.tsx`.
- **Locale conflict handling**: edit pages prefetch existing translations and use a locale swap dialog when selecting a locale that already exists in translations; the backend accepts `confirm_swap`. Evidence: `resources/js/app/pages/*/admin/edit/page.tsx`, `app/Modules/*/Application/UseCases/Update*/Update*.php`.
- **Multipart form submissions**: create/edit pages that upload images submit `forceFormData: true` and often use method spoofing (`_method: 'put'`) for updates. Evidence: `resources/js/app/pages/projects/admin/edit/page.tsx`, `resources/js/app/pages/initiatives/admin/edit/page.tsx`.

## Public CMS sections (Content Management)

The public website UI is built from content-managed pages and “section components” contributed by frontend modules.

- Each module can expose a section registry mapping template keys → React components. Evidence: `resources/js/modules/*/sectionRegistryProvider.ts`.
- The Content Management frontend renderer resolves section fields through a shared field resolver and receives capability-enriched section data from the backend. Evidence: `resources/js/modules/content-management/features/page-rendering`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`.

## Build and tooling

- Scripts and tooling: `package.json`
- Vite: `vite.config.js` (Laravel + React integration, aliases)
- TypeScript: `tsconfig.json`
- Linting/formatting: `eslint.config.js`, `.prettierrc`
- Tailwind: `tailwind.config.ts`, `postcss.config.js`

## Module documentation

- Module index: `docs/modules/README.md`
