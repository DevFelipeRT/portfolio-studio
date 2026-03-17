# Frontend Common i18n

This document describes the shared frontend internationalization runtime located at `resources/js/common/i18n`.

## Overview

The `common/i18n` module centralizes:

- `i18next` initialization
- lazy loading of translation bundles by locale
- dynamic registration of translation scopes
- React integration through a provider, hooks, and a preload gate
- public APIs consumed by the Inertia boot layer and frontend modules

The application uses a scope-prefixed namespace convention: each bundle is registered in `i18next` as `<scopeId>.<namespace>`. Examples include `common.validation`, `layouts.navigation`, and `projects.form`.

This convention exists to avoid collisions between modules and keep bundles isolated by scope. In practice, frontend consumers should prefer scope-local helpers such as `useProjectsTranslation(...)`, `useLayoutsTranslation(...)`, and `useTranslation(...)` instead of manually assembling fully qualified namespaces.

Primary evidence:

- `resources/js/common/i18n/index.ts`
- `resources/js/common/i18n/runtime.ts`
- `resources/js/common/i18n/i18next/preloader.ts`
- `resources/js/common/i18n/registry/registry.ts`
- `resources/js/common/i18n/react/I18nScopeGate.tsx`

## Module structure

The module is organized into the following layers:

- `resources/js/common/i18n/runtime.ts`: normalizes runtime locale configuration and ensures `i18next` is initialized
- `resources/js/common/i18n/i18next/*`: shared `i18next` instance, React provider, hooks, scoped namespace helpers, and the bridge from bundle loaders to resource bundles
- `resources/js/common/i18n/preloading/*`: preloading for shared bundles and registered scopes
- `resources/js/common/i18n/registry/*`: singleton registry for preloaders and lazy loading of scope definitions
- `resources/js/common/i18n/react/*`: `I18nRuntimeProvider`, `useTranslation`, `I18nScopeGate`, and `LanguageSelector`
- `resources/js/common/i18n/locales/*/*.ts`: translation catalogs for the `common` scope

## The `common` scope

The module provides its own `common` scope, discovered through `import.meta.glob('../../locales/*/*.ts')` in `resources/js/common/i18n/preloading/bundle/bundleLoaders.ts`.

The currently defined shared namespaces live in `resources/js/common/i18n/namespaces.ts`:

- `accessibility`
- `actions`
- `dateTime`
- `dialog`
- `feedback`
- `form`
- `i18n`
- `labels`
- `languageSelector`
- `pagination`
- `state`
- `table`
- `themeToggle`
- `validation`

These files follow the convention `resources/js/common/i18n/locales/<locale>/<namespace>.ts`. The repository currently contains bundles for `en` and `pt_BR`.

## Boot flow

During the Inertia boot sequence, the frontend resolves the localization context provided by the backend and initializes the shared runtime before the first mount.

Current flow:

1. `resources/js/app/bootstrap/bootApplication.tsx` initializes the shell with `resolveAppLocalizationContext(...)`.
2. `createInitializedI18nRuntime(...)` normalizes `supportedLocales`, `defaultLocale`, and `fallbackLocale`.
3. `preloadI18nBundles(...)` preloads the shell with `includeCommon: true` and `scopeIds: ['layouts']`.
4. The application mounts with `I18nRuntimeProvider` through the standard page decoration flow in `resources/js/app/shell/page/decoratePageComponent.tsx`.

In practice, this guarantees that shared shell translations from `common` and `layouts` are available on first render.

## Inertia integration

The canonical request localization boundary is `resources/js/app/shell/runtime/localizationContext.ts`.

It normalizes:

- `currentLocale`
- `defaultLocale`
- `fallbackLocale`
- `supportedLocales`
- `scope` and localization profile (`public` or `system`)
- persistence metadata such as the cookie name and locale-switch endpoint

This context is used both during boot and by React components that need to decide whether rendering should wait for scope preloading.

## Dynamic scope registration

Scopes beyond `common` do not need to be imported centrally. The module uses a singleton registry with two distinct steps:

1. `define(id, load)` declares how a scope definition should be loaded.
2. `register(id, preloader)` registers the concrete preloader once the module is imported.

Definition discovery happens in `resources/js/common/i18n/registry/definition/definitionLoaders.ts`, which scans:

- `resources/js/modules/*/i18n/definition.ts`
- `resources/js/app/layouts/i18n/definition.ts`

Expected convention for each scope:

- `definition.ts`: calls `createI18nRegistry().define('<scopeId>', () => import('./environment'))`
- `environment.ts`: builds loaders with `import.meta.glob('./locales/*/*.ts')`, creates the preloader with `createI18nextPreloader(...)`, and calls `register(...)`

Concrete example:

- `resources/js/modules/projects/i18n/definition.ts`
- `resources/js/modules/projects/i18n/environment.ts`

Without this pair of files, the registry cannot resolve the scope on demand.

This is an explicit authoring convention of the module:

- `definition.ts` is the lazy discovery boundary
- `environment.ts` is the registration boundary
- registration happens by side effect when the environment module is imported

## Bundle preloading

Preloading is divided between the shared shell and page-specific scopes:

- `commonI18nPreloader` handles bundles under `resources/js/common/i18n/locales/*/*.ts`
- `preloadI18nBundles(...)` preloads `common` and, optionally, the requested scopes
- `preloaderForI18nScopes(...)` resolves preloaders for specific scopes through the registry

When a scope is loaded, `createI18nextPreloader(...)`:

- indexes the loaders by locale
- derives the namespace from the module path
- loads the files for the requested locale
- installs each translation tree into `i18next` via `addResourceBundle(...)`

The current preload granularity is scope-level: enabling a scope id preloads all bundles for that scope and locale, not only the exact namespace used by the current subtree. This keeps the registry model simple and module authoring lightweight, at the cost of sometimes loading more translation data than a specific render path strictly needs.

## Page behavior by localization profile

The project distinguishes between public pages and system/admin pages:

- public pages do not block the main subtree on frontend scope preloading because CMS content already arrives localized from the backend
- system pages may wait for the scopes declared by the page

This behavior is implemented in `resources/js/app/shell/page/resolvePageI18nContent.tsx`:

- the content always receives the shared provider
- `I18nScopeGate` is only applied when the localization profile is `system`
- the gate observes `Component.i18n` and `Component.getI18nScope(...)`

Current examples:

- admin pages declare static scopes such as `Create.i18n = ['projects']`
- the public rendered CMS page uses `getI18nScope(...)` to derive scopes dynamically

Expected behavior for page-level i18n is:

- the shell bootstrap preloads `common` + `layouts` before the first mount
- public pages should not wait on module-scoped frontend bundles just to render CMS-delivered content
- system/admin pages may wait on declared module scopes because their UI labels and controls depend on client-side translations
- scope declaration remains the contract: if a system page needs module i18n, it must declare that through `Page.i18n` or `Page.getI18nScope`

Related design choices:

- the system favors incremental migration over a fully blocking global bootstrap, so it does not stop every page until every possible scoped bundle is loaded
- `I18nScopeGate` favors continuity by default and keeps the previous subtree visible during scope/locale transitions unless the caller opts into stricter blocking with `keepPreviousContentDuringLoad={false}`

## Public API surface

The public surface exported by `resources/js/common/i18n/index.ts` includes:

- `I18N_NAMESPACES`
- `createInitializedI18nRuntime`
- `getI18nRuntime`
- `setI18nRuntimeLocale`
- `preloadI18nBundles`
- `preloaderForI18nScopes`
- `createI18nRegistry`
- `LanguageSelector`
- `I18nRuntimeProvider`
- `I18nScopeGate`
- `useTranslation`

## React hooks and components

### `useTranslation(namespace?)`

Shared hook for the `common` scope, implemented on top of `createScopedTranslationHook('common')`.

Primary contract:

- reads the current locale from context
- resolves keys within `common.<namespace>`
- accepts an optional per-call fallback
- returns memoized handlers whose identities change only when the effective
  locale or namespace changes

Existing usage examples:

- `useTranslation(I18N_NAMESPACES.i18n)`
- `useTranslation(I18N_NAMESPACES.languageSelector)`

Hooks created through `createScopedTranslationHook(...)` follow the same
stability rule. This keeps React dependency arrays aligned with semantic i18n
changes instead of incidental rerenders.

Operational guidance:

- data-loading effects should depend on domain inputs such as entity ids, not on
  `translate` function references
- async UI state should prefer flags, keys, or normalized error payloads over
  storing already translated strings in state

### `I18nRuntimeProvider`

Thin wrapper around the `i18next` React provider. This is the standard React boundary for the shared runtime.

### `I18nScopeGate`

Component that waits for the required scopes to finish preloading for the current locale and, optionally, the fallback locale.

Relevant characteristics:

- deduplicates and normalizes `scopeIds`
- supports `loadingFallback`
- can delay loading UI display through `loadingDelayMs`
- keeps previous content visible during transitions by default through `keepPreviousContentDuringLoad`

### `LanguageSelector`

Shared component that uses the `i18n` and `languageSelector` namespaces to render labels and accessibility text for the locale selector.

## Locale switching

The React locale-switch flow is implemented in `resources/js/common/i18n/react/hooks/useSetI18nLocale.tsx`.

Before applying the new locale, it preloads:

- `common` bundles
- the `layouts` scope
- the scopes declared by the current page

It then calls `setI18nRuntimeLocale(...)` to synchronize the `i18next` runtime.

This reduces flicker and avoids switching the visible locale before the shell and current module bundles are ready.

## Authoring convention for frontend modules

To add i18n to a frontend module, the current convention is:

1. Create `resources/js/modules/<module>/i18n/locales/<locale>/<namespace>.ts`.
2. Create `resources/js/modules/<module>/i18n/environment.ts` using `import.meta.glob('./locales/*/*.ts')`, `createI18nextPreloader(...)`, and `createI18nRegistry().register(...)`.
3. Create `resources/js/modules/<module>/i18n/definition.ts` using `createI18nRegistry().define(...)`.
4. Expose a scope-specific hook such as `useProjectsTranslation(...)` so consumers do not need to manage the `<scopeId>.` prefix directly.
5. Declare the scope on the page with `Page.i18n = ['<scopeId>']` or `Page.getI18nScope = (...) => [...]`.

This pattern is already used by:

- `projects`
- `courses`
- `experiences`
- `contact-channels`
- `layouts`

## Current limitations and trade-offs

The module already tracks implementation constraints in `resources/js/common/i18n/KNOWN_ISSUES.md`. The most relevant points today are:

- scope ids remain stringly typed
- dynamic loading depends on convention and side effects (`definition.ts` + `environment.ts`)
- preload granularity is scope-level rather than key-level or component-level
- locale switching may warm more bundles than the current screen strictly requires
- missing keys and missing bundles are still difficult to distinguish quickly
