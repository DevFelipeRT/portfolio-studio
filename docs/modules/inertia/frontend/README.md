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

The runtime wraps content in the application i18n provider configured from Inertia shared props (`props.localization`) (`resources/js/app/inertia/page/utils/WithI18nProvider.tsx`).

