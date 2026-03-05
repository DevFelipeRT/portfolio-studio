# Inertia (Frontend)

Scope: the client-side Inertia runtime used to boot the React application, resolve pages by key, and apply global providers (i18n, layout).

Evidence:

- App entry: `resources/js/app.tsx`
- Inertia boot: `resources/js/app/inertia/InertiaApp.tsx`
- Initial CSR page JSON reader: `resources/js/app/inertia/page/initialPage.ts`
- Page resolver: `resources/js/app/inertia/page/InertiaPageResolver.tsx`
- Page registry: `resources/js/app/pages/pageRegistryProvider.ts`
- Root HTML shell: `resources/views/app.blade.php`
- i18n wrapper: `resources/js/app/inertia/page/utils/WithI18nProvider.tsx`
- Runtime state helpers (title/settings): `resources/js/app/inertia/utils/runtimeState.ts`, `resources/js/app/inertia/utils/title.ts`

## Boot sequence (CSR)

1. `resources/js/app.tsx` calls `bootInertiaApp()` (`resources/js/app.tsx`).
2. `bootInertiaApp()` reads the initial page from `<script id="inertia-page">...</script>` (`resources/js/app/inertia/page/initialPage.ts`, `resources/views/app.blade.php`).
3. `createInertiaApp(...)` mounts the app and resolves pages by key via the registry (`resources/js/app/inertia/InertiaApp.tsx`).

## Page resolution and the registry

Pages are registered under `resources/js/app/pages/*/pages.ts` and aggregated by `import.meta.glob('./*/pages.ts', { eager: true })` into a single registry object (`resources/js/app/pages/pageRegistryProvider.ts`).

When the backend calls `Inertia::render('<key>')`, the frontend looks up a matching loader in the registry and imports the module (`resources/js/app/inertia/page/InertiaPageResolver.tsx`).

If a key is missing, the resolver throws: `Page not found in registry: <key>` (`resources/js/app/inertia/page/InertiaPageResolver.tsx`).

## Shared providers and runtime state

The Inertia setup initializes a runtime state snapshot derived from initial shared props (e.g. website meta title template) (`resources/js/app/inertia/utils/runtimeState.ts`, `resources/js/app/inertia/utils/setup.tsx`).

The runtime wraps content in an i18next provider configured from Inertia shared props (`props.localization`) (`resources/js/app/inertia/page/utils/WithI18nProvider.tsx`).

## i18n scoping (preload)

The app preloads translation bundles for i18next via a scoped preloader. To avoid preloading every module on every page, pages can declare which i18n contributions they need:

- Static scope: `Page.i18n = ['projects', 'courses']`
- Dynamic scope: `Page.getI18nScope = (props) => ['contact-channels']` (useful for CMS/section-driven pages)

The scope is collected in the page decorator (`resources/js/app/inertia/page/PageComponent.tsx`) and turned into a scoped preloader via the i18n registry:

- Registry factory: `createI18nRegistry()` (`resources/js/common/i18n/registry/createI18nRegistry.ts`)
- Scope → preloader: `preloaderFor(scopeIds)`

### Conventions for modules/layouts

Module and layout i18n preloaders are resolved on-demand through registry definitions:

- `resources/js/modules/<id>/i18n/definition.ts` should call:
  - `createI18nRegistry().define('<id>', () => import('./environment'))`
- `resources/js/modules/<id>/i18n/environment.ts` should call:
  - `createI18nRegistry().register('<id>', <i18nextPreloader>)`

Layouts follow the same pattern under `resources/js/app/layouts/i18n/`.

### Local loading gates

For dynamic features (e.g. CMS rendered pages), you can block only a subtree until
its scope preloads using `I18nScopeGate`:

- Gate: `resources/js/common/i18n/react/I18nScopeGate.tsx`
- Example usage: `resources/js/app/pages/content-management/public/rendered-page/page.tsx`

For dynamic CMS sections, section providers can expose a minimal `i18n` metadata list so page-rendering can derive scope from `sections`:

- Example: `resources/js/modules/contact-channels/sectionRegistryProvider.ts`

### Known issues

See `resources/js/common/i18n/KNOWN_ISSUES.md` for tradeoffs such as module translators being used before catalogs preload when the UI is non-blocking.
