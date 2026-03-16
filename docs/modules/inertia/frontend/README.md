# Inertia (Frontend)

Scope: the client-side Inertia integration that wires the framework adapter into the browser bootstrap while the application policy lives in the shell layer.

Evidence:

- App entry: `resources/js/app.tsx`
- Browser boot: `resources/js/app/bootstrap/bootApplication.tsx`
- Initial CSR page JSON reader: `resources/js/app/bootstrap/readInitialPage.ts`
- Page resolver: `resources/js/app/bootstrap/createPageComponentResolver.tsx`
- Page registry: `resources/js/app/pages/pageRegistryProvider.ts`
- Root HTML shell: `resources/views/app.blade.php`
- Shell page wrapper: `resources/js/app/shell/page/wrapWithShellProviders.tsx`
- Runtime state helpers (title/settings + localization context): `resources/js/app/shell/runtime/runtimeState.ts`, `resources/js/app/shell/runtime/localizationContext.ts`, `resources/js/app/shell/runtime/title.ts`

## Boot sequence (CSR)

1. `resources/js/app.tsx` calls `bootApplication()` (`resources/js/app.tsx`).
2. `bootApplication()` reads the initial page from `<script id="inertia-page">...</script>` (`resources/js/app/bootstrap/readInitialPage.ts`, `resources/views/app.blade.php`).
3. The shell initializes runtime state and preloads shell i18n bundles before mount (`resources/js/app/shell/boot/initializeShell.ts`).
4. `createInertiaApp(...)` mounts the app and resolves pages by key through the registry (`resources/js/app/bootstrap/bootApplication.tsx`).

## Page resolution and the registry

Pages are registered under `resources/js/app/pages/*/pages.ts` and aggregated by `import.meta.glob('./*/pages.ts', { eager: true })` into a single registry object (`resources/js/app/pages/pageRegistryProvider.ts`).

When the backend calls `Inertia::render('<key>')`, the frontend looks up a matching loader in the registry and imports the module (`resources/js/app/bootstrap/createPageComponentResolver.tsx`).

If a key is missing, the resolver throws: `Page not found in registry: <key>` (`resources/js/app/bootstrap/createPageComponentResolver.tsx`).

## Shared providers and runtime state

The backend owns request locale-context selection and shares it explicitly as `page.props.localization.scope`, with `system` for authenticated/admin requests and `public` for public website requests (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`).

The frontend normalizes that payload exactly once in `resolveAppLocalizationContext(...)` / `useAppLocalizationContext()` (`resources/js/app/shell/runtime/localizationContext.ts`). Profile identity is centralized in `resources/js/app/shell/runtime/localizationProfiles.ts`, so `system` and `public` are resolved through a typed registry rather than ad hoc string comparisons throughout the app. That canonical context includes:

- scope (`system` | `public`)
- profile metadata (`profile.id`, `profile.isSystem`, `profile.isPublic`)
- current/default/fallback locale
- supported locales
- persistence policy (`apiEndpoint`, `cookieName`, `persistClientCookie`)

The shell initialization stores a runtime state snapshot derived from initial shared props (e.g. website meta title template and normalized localization context) through the canonical runtime helpers in `resources/js/app/shell/runtime/*` (`resources/js/app/shell/runtime/runtimeState.ts`, `resources/js/app/shell/boot/initializeShell.ts`).

The i18n boot flow goes through `initializeI18nRuntime(...)` plus `preloadI18nBundles(...)` before mount, and the mounted tree is wrapped by `I18nRuntimeProvider` via `resources/js/app/shell/page/wrapWithShellProviders.tsx`.

App boot (`resources/js/app/bootstrap/bootApplication.tsx`), provider preload (`resources/js/app/shell/page/wrapWithShellProviders.tsx`), and the locale-switch integration (`resources/js/app/layouts/partials/Header.tsx`, `resources/js/common/i18n/react/hooks/useSetI18nLocale.tsx`) all consume that same normalized app context instead of reconstructing policy from raw props.

## i18n scoping (preload)

The app preloads translation bundles for i18next via the shared preloading API in `resources/js/common/i18n/preloading/index.ts`. To avoid preloading every module on every page, pages can declare which i18n contributions they need:

- Static scope: `Page.i18n = ['projects', 'courses']`
- Dynamic scope: `Page.getI18nScope = (props) => ['contact-channels']` (useful for CMS/section-driven pages)

The scope is collected in the page decorator (`resources/js/app/shell/page/decoratePageComponent.tsx`) and handed to `wrapWithShellProviders(...)`. Two different preload timings are involved:

- `bootApplication()` preloads the initial shell (`common` + `layouts`) before the first mount.
- `wrapWithShellProviders(...)` then starts scope preload from a React effect.
- For `system` pages, the page decorator wraps only the page subtree in `I18nScopeGate` when the page declares module scopes, so layouts remain visible while admin/module bundles finish loading.
- For `public` pages, that gate is intentionally skipped because the CMS payload already provides the main localized content.

The same runtime-backed preload path is also reused during locale switching:

- Registry factory: `createI18nRegistry()` (`resources/js/common/i18n/registry/registry.ts`)
- Scope -> preload orchestration: `preloadI18nBundles({ scopeIds, ... })`

### Conventions for modules/layouts

Module and layout i18n preloaders are resolved on-demand through registry definitions:

- `resources/js/modules/<id>/i18n/definition.ts` should call:
  - `createI18nRegistry().define('<id>', () => import('./environment'))`
- `resources/js/modules/<id>/i18n/environment.ts` should call:
  - `createI18nRegistry().register('<id>', <i18nextPreloader>)`

Layouts follow the same pattern under `resources/js/app/layouts/i18n/`.

### Local loading gates

For dynamic features (e.g. CMS rendered pages), you can block only a subtree until its scope preloads using `I18nScopeGate`:

- Gate: `resources/js/common/i18n/react/I18nScopeGate.tsx`
- Current state: the page decorator now applies it centrally for `system` pages that declare module scopes.
- Public pages such as `RenderedPage` intentionally stay outside that gate.

For dynamic CMS sections, section providers can expose a minimal `i18n` metadata list so page-rendering can derive scope from `sections`:

- Example: `resources/js/modules/contact-channels/sectionRegistryProvider.ts`

### Known issues

See `resources/js/common/i18n/KNOWN_ISSUES.md` for the remaining i18n limitations and tradeoffs, such as registry conventions and scope-preload behavior.
