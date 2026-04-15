# Frontend Overview

This document is an overview of cross-cutting frontend architecture and conventions. Module-specific UI and API contracts are documented under [`docs/modules/`](../modules/).

## Tech stack (evidence-based)

- React + TypeScript + Vite (`package.json`, `resources/js/app.tsx`, `vite.config.js`, `tsconfig.json`)
- Inertia client adapter: `@inertiajs/react` (`package.json`, `resources/js/app/bootstrap/bootApplication.tsx`)
- HTTP client: Axios (`package.json`, `resources/js/**/core/api/*.ts`)
- UI primitives: Radix-based components + Tailwind (`package.json`, `resources/css/app.css`, `tailwind.config.ts`)

## Entry points (Inertia + Vite)

- Frontend entry: `resources/js/app.tsx`
- Browser boot: `resources/js/app/bootstrap/bootApplication.tsx`
- Root HTML shell: `resources/views/app.blade.php`
- CSS entry: `resources/css/app.css`

Inertia SSR is configured via `config/inertia.php` (env-controlled). Evidence: `resources/js/app/bootstrap/bootApplication.tsx`, `resources/views/app.blade.php`, `config/inertia.php`.

## Page registry (Inertia page resolution)

Inertia pages are organized under `resources/js/app/pages/*`. Each feature folder exports a `registerPages(...)` function from a `pages.ts` manifest, and the registry provider eagerly loads those manifests.

Evidence:

- Registry provider: `resources/js/app/pages/pageRegistryProvider.ts`
- Example manifests: `resources/js/app/pages/projects/pages.ts`, `resources/js/app/pages/initiatives/pages.ts`

Backend controllers render pages using the same page keys via `Inertia::render(...)`. Evidence: `app/Modules/*/Http/Controllers/*Controller.php`.

## Frontend structure (app vs modules)

- `resources/js/app/`: application shell, bootstrap wiring, layouts, navigation
- `resources/js/modules/`: domain-oriented feature modules (admin UI + public CMS sections)
- `resources/js/common/`: shared utilities such as i18n, rich text, and the `page-runtime` facade used to keep most frontend code decoupled from direct Inertia imports
- `resources/js/components/`: reusable UI primitives

Evidence: folder structure under `resources/js/`.

## Layout composition

Layout structure and horizontal content alignment are now intentionally separated:

- `resources/js/app/layouts/PublicLayout.tsx` and `resources/js/app/layouts/AuthenticatedLayout.tsx` own the shell regions (`header`, `main`, `footer`) but no longer impose a single `max-w-*` wrapper around arbitrary page content.
- `resources/js/app/layouts/primitives/ContentContainer.tsx` is the shared source of truth for horizontal width and gutters (`reading`, `default`, `wide`, `full`).
- `resources/js/app/layouts/primitives/PageContent.tsx` is the semantic body boundary for private/admin pages, composing `ContentContainer` and declaring the effective page measure (`form`, `detail`, `editor`, `default`, `wide`).
- `resources/js/app/layouts/primitives/Section.tsx` and `resources/js/app/layouts/primitives/SectionContent.tsx` are the semantic building blocks for CMS and marketing-style sections, separating full-width section surfaces from aligned inner content.
- `resources/js/app/layouts/regions/HeaderBar.tsx` and `resources/js/app/layouts/regions/FooterBar.tsx` keep shell regions full-width while aligning their inner content through `ContentContainer`.

The intended boundary rules are:

- public/CMS sections: `Section` defines the surface and `SectionContent` defines the inner measure
- private/admin pages: `PageContent` defines the page body boundary
- `ContentContainer` remains an infrastructure primitive used by semantic wrappers and shell regions, not the default final wrapper for page bodies

For content-managed public pages, `resources/js/modules/content-management/features/page-rendering/rendering/section-renderer/SectionRenderer.tsx` now resolves section layout metadata centrally and passes width/surface/spacing intent down to section components and the generic fallback renderer. This keeps container policy out of the global shell and closer to the section contract.

## Common frontend docs

- App frontend docs index: [`docs/frontend/app/README.md`](./app/README.md)
- Shared frontend docs index: [`docs/frontend/common/README.md`](./common/README.md)
- Shared i18n runtime: [`docs/frontend/common/i18n/README.md`](./common/i18n/README.md)
- Shared table foundation: [`docs/frontend/common/table/README.md`](./common/table/README.md)

## Routing on the client (Ziggy)

Frontend code uses Ziggy’s `route(...)` helper. In this codebase, the `route` function is provided globally by the root Blade view via Ziggy’s `@routes` directive:

- Blade includes Ziggy routes: `resources/views/app.blade.php` (`@routes`)

Additionally, the backend also shares a `ziggy` Inertia prop (routes + current location) via:

- `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

Note: the frontend currently doesn’t read `props.ziggy` directly (it relies on the global `route`), but the prop is available if we later want to pass Ziggy config explicitly (e.g. SSR or non-global usage).

## Localization (i18n)

Localization metadata (locale + supported locales) is shared to the client via the Inertia middleware, and frontend i18n code lives under `resources/js/common/i18n/`. The backend now also sends an explicit `localization.scope` discriminator (`system` or `public`), and `resources/js/app/shell/runtime/localizationContext.ts` is the canonical frontend boundary that normalizes this request context before boot, preload, or locale switching consume it. Evidence: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`, `resources/js/app/shell/runtime/localizationContext.ts`, `resources/js/common/i18n/`.

Translation bundles are loaded lazily via Vite `import.meta.glob` and follow the convention `.../locales/<locale>/<namespace>.ts`. Namespaces are intentionally free-form (modules may organize them however they want, e.g. `forms`, `table`, `list`) as long as they follow that folder/file naming convention.

The canonical frontend i18n flow is now split into:

- `resources/js/common/i18n/runtime.ts` for runtime initialization over the shared i18next instance
- `resources/js/common/i18n/i18next/*` for provider/hooks/runtime adapters and the bundle-to-i18next preloader bridge
- `resources/js/common/i18n/preloading/*` for common/scoped/fallback bundle preloading and locale bundle caching
- `resources/js/common/i18n/registry/*` for lazy scope definition loading and preloader registration
- `resources/js/common/i18n/react/*` for runtime-backed React providers, gates, and hooks
- `resources/js/app/shell/runtime/*` for app request-context normalization and runtime helpers
- `resources/js/app/bootstrap/*` for browser bootstrapping and Inertia wiring

The app uses i18next/react-i18next for translation resolution and keeps the same bundle file convention. Evidence: `resources/js/common/i18n/i18next/preloader.ts`, `resources/js/common/i18n/i18next/i18next.ts`, `resources/js/common/i18n/preloading/bundle/bundleLoaders.ts`.

At runtime, the app treats public and system pages differently: the shell (`common` + `layouts`) is preloaded before the first mount for both, public pages remain non-blocking because CMS content is already localized by the backend, and system/admin pages can gate only the page subtree when they declare module scopes through `Page.i18n` / `Page.getI18nScope`. See [`docs/frontend/common/i18n/README.md`](./common/i18n/README.md) for the module-specific behavior and authoring contract. Evidence: `resources/js/app/bootstrap/bootApplication.tsx`, `resources/js/app/shell/page/decoratePageComponent.tsx`, `resources/js/app/shell/page/wrapWithShellProviders.tsx`.

Build config keeps locale bundles code-split by locale. Evidence: `vite.config.js`.

## Common admin UX patterns

These are patterns visible across multiple modules:

- **Overlays instead of `show` pages**: admin index pages often open a client-side overlay/modal for read-only details rather than navigating to a `*.show` route (e.g. Courses, Initiatives). The shared composition model for those detail surfaces now lives in `resources/js/common/table/item-dialog/*` as `ItemDialog`, which keeps header, badges, metadata, actions, and body layout consistent across modules, while semantic badge rendering itself now lives under `resources/js/components/badges/*`. Evidence: `resources/js/app/pages/courses/admin/index/page.tsx`, `resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/common/table/item-dialog/ItemDialog.tsx`, `resources/js/components/badges/index.ts`.
- **Translations modal**: edit pages open a “Manage translations” modal that calls `{entity}.translations.*` JSON endpoints via `window.axios` + Ziggy `route(...)`. Evidence: `resources/js/modules/*/core/api/translations.ts`, `resources/js/modules/*/ui/TranslationModal.tsx`.
- **Locale conflict handling**: edit pages prefetch existing translations and use a locale swap dialog when selecting a locale that already exists in translations; the backend accepts `confirm_swap`. Evidence: `resources/js/app/pages/*/admin/edit/page.tsx`, `app/Modules/*/Application/UseCases/Update*/Update*.php`.
- **Multipart form submissions**: create/edit pages that upload images submit `forceFormData: true` and often use method spoofing (`_method: 'put'`) for updates. Evidence: `resources/js/app/pages/projects/admin/edit/page.tsx`, `resources/js/app/pages/initiatives/admin/edit/page.tsx`.

## Public CMS sections (Content Management)

The public website UI is built from content-managed pages and “section components” contributed by frontend modules.

- Each module can expose a section registry mapping template keys → React components. Evidence: `resources/js/modules/*/sectionRegistryProvider.ts`.
- The Content Management frontend renderer resolves section fields through a shared field resolver and receives capability-enriched section data from the backend. Evidence: `resources/js/modules/content-management/features/page-rendering`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`.

## Build and tooling

- Scripts and tooling: `package.json`
- Vite: `vite.config.js` (Laravel + React integration, aliases, dedupe, chunking, dev server)
- TypeScript: `tsconfig.json`
- Linting/formatting: `eslint.config.js`, `.prettierrc`
- Tailwind: `tailwind.config.ts`, `postcss.config.js`

### Build pipeline

- `npm run build` runs `tsc && cross-env ASSET_URL='' vite build`. That means production builds perform a TypeScript compile check before emitting frontend assets. Evidence: `package.json`.
- The explicit `ASSET_URL=''` keeps the generated asset URLs relative to the Laravel app instead of inheriting a different asset base from the shell environment. Evidence: `package.json`.
- Laravel Vite integration builds from `resources/css/app.css` and `resources/js/app.tsx`. Evidence: `vite.config.js`.

### Vite configuration details

- Plugins: Laravel Vite plugin, React plugin, and Tailwind Vite plugin. Evidence: `vite.config.js`.
- Module resolution includes the `@` alias for `resources/js/` and explicit React / ReactDOM aliases to keep imports consistent. Evidence: `vite.config.js`.
- `resolve.dedupe` forces a single runtime instance for `react`, `react-dom`, `react-i18next`, and `i18next`. This matters because duplicate instances can break hooks/context behavior and i18n state sharing. Evidence: `vite.config.js`.
- Build chunking is customized:
  - locale bundles under `.../i18n/locales/<locale>/...` become `i18n-<locale>` chunks
  - core React/Inertia/i18n vendor dependencies are grouped into `vendor-core`
  - shared internal i18n runtime code is grouped into `app-i18n-core`
  Evidence: `vite.config.js`.

### Dev server behavior

- Dev-server-only options are applied only when running `vite` in serve mode; production builds do not receive the `server` block. Evidence: `vite.config.js`.
- Host and port come from `VITE_BIND` and `VITE_PORT`, defaulting to `0.0.0.0` and `5173`. Evidence: `.env.example`, `vite.config.js`.
- The server uses `strictPort: true`, `cors: true`, and HMR over WebSocket on `/vite-hmr`. Evidence: `vite.config.js`.
- In the Docker workflow, the dedicated `vite` service starts `npm run dev -- --host 0.0.0.0 --port "$VITE_PORT" --strictPort` and exposes the same port externally. Evidence: `docker-compose.yml`.

## Module documentation

- Module index: [`docs/modules/README.md`](../modules/README.md)
- Root project overview: [`README.md`](../../README.md)
