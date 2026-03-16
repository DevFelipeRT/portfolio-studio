# Frontend App Shell

This document describes the application shell layer located at `resources/js/app/shell`.

## Overview

The `app/shell` module owns the application-specific runtime policy that sits between shared page-runtime abstractions and the browser bootstrap layer.

It is responsible for:

- application-facing page types
- localization context normalization
- runtime state derived from shared page props
- document title rendering policy
- page decoration with layouts and i18n providers
- shell bundle preloading before first mount
- exposing the page registry through a shell-facing port

Primary evidence:

- `resources/js/app/shell/index.ts`
- `resources/js/app/shell/types.ts`
- `resources/js/app/shell/runtime/*`
- `resources/js/app/shell/page/*`
- `resources/js/app/shell/boot/*`
- `resources/js/app/shell/registry/*`

## Responsibilities

The shell owns application policy, not framework bootstrapping.

It is responsible for:

- translating backend shared props into normalized app runtime state
- defining app-facing type names such as `AppPageProps` and `AppPageComponent`
- composing layout and i18n behavior around loaded pages
- preloading shell translations needed for first render
- exposing a stable app-facing registry boundary to the bootstrap layer

It is not responsible for:

- direct DOM mounting
- reading HTML-embedded initial page JSON
- calling `createInertiaApp(...)`
- implementing the technical page-runtime adapter

Those concerns live in `resources/js/app/bootstrap/*` and `resources/js/common/page-runtime/*`.

## Module structure

The module is organized into the following layers:

- `resources/js/app/shell/index.ts`: public shell facade
- `resources/js/app/shell/types.ts`: app-facing shared types and constants
- `resources/js/app/shell/runtime/*`: localization profiles, normalized localization context, runtime state, and document-title helpers
- `resources/js/app/shell/page/*`: page decoration, layout composition, localized value helpers, page i18n scope handling, and provider wrapping
- `resources/js/app/shell/boot/*`: shell initialization and preload policy used before first mount
- `resources/js/app/shell/registry/*`: shell-facing page registry access

## Public API surface

The public surface exported by `resources/js/app/shell/index.ts` includes:

- `AppPageProps`
- `AppPageComponent`
- `APP_LOCALIZATION_PROFILE_IDS`
- `resolveAppLocalizationContext`
- `useAppLocalizationContext`
- `getAppRuntimeState`
- `initializeAppRuntimeState`
- `resolveDocumentTitle`
- `decoratePageComponent`
- `initializeShell`
- `preloadShellBundles`
- `getPageRegistry`

The intended import path for consumers is:

```ts
import {
  type AppPageProps,
  getPageRegistry,
  initializeShell,
  resolveAppLocalizationContext,
  useAppLocalizationContext,
} from '@/app/shell';
```

## Runtime policy

The shell normalizes request localization exactly once through `resolveAppLocalizationContext(...)`.

That normalized context includes:

- scope (`system` | `public`)
- localization profile metadata
- current/default/fallback locale
- supported locales
- locale persistence metadata

The shell also stores a runtime snapshot derived from page props, including:

- normalized localization context
- meta title template
- localized site name map
- localized default meta title map
- owner name

Evidence:

- `resources/js/app/shell/runtime/localizationContext.ts`
- `resources/js/app/shell/runtime/localizationProfiles.ts`
- `resources/js/app/shell/runtime/runtimeState.ts`
- `resources/js/app/shell/runtime/title.ts`

## Page composition

The page layer decorates each loaded page component with application-wide composition rules.

The current flow is:

1. `decoratePageComponent(...)` wraps the loaded page component.
2. `resolvePageI18nContent(...)` derives static and dynamic scope ids.
3. `resolveLayoutContent(...)` applies the page `layout` convention.
4. `wrapWithShellProviders(...)` mounts `I18nRuntimeProvider` and starts scoped preload behavior.

For `system` pages, module scopes may be gated through `I18nScopeGate`.
For `public` pages, the page subtree remains non-blocking because the main content is already localized by the backend.

Evidence:

- `resources/js/app/shell/page/decoratePageComponent.tsx`
- `resources/js/app/shell/page/resolvePageI18nContent.tsx`
- `resources/js/app/shell/page/resolveLayoutContent.ts`
- `resources/js/app/shell/page/wrapWithShellProviders.tsx`

## Boot policy

Before the first mount, the shell initializes app runtime state and preloads the shell translation bundles needed for shared UI.

The current boot policy is:

- store initial runtime metadata via `initializeAppRuntimeState(...)`
- create an initialized i18n runtime
- preload `common` bundles plus the `layouts` scope

Evidence:

- `resources/js/app/shell/boot/initializeShell.ts`
- `resources/js/app/shell/boot/preloadShellBundles.ts`

## Registry boundary

The shell currently exposes the page registry as a simple port around the app pages manifest aggregation.

Today the registry source still lives in:

- `resources/js/app/pages/pageRegistryProvider.ts`

The shell-facing boundary is:

- `resources/js/app/shell/registry/pageRegistry.ts`

This keeps the bootstrap layer from depending directly on `app/pages`.

## Relationship to `common/page-runtime` and `app/bootstrap`

Today the separation is:

- `common/page-runtime`: technical runtime abstraction for page props, links, forms, head, and navigation
- `app/shell`: application policy built on top of that abstraction
- `app/bootstrap`: browser entry and minimal Inertia wiring

This means `app/shell` can consume `usePageProps` from `common/page-runtime` while staying free of direct `@inertiajs/react` imports.

## Authoring guidance

When adding new app-level runtime behavior:

1. Put framework-neutral application policy in `@/app/shell`.
2. Keep app-facing names technology-neutral (`App*`, `Shell*`) rather than `Inertia*`.
3. Use `@/common/page-runtime` for technical page access instead of importing Inertia directly.
4. Keep page decoration rules centralized here rather than duplicating them across pages or layouts.
5. Add docs when new shell responsibilities or public exports appear.

## Current trade-offs

Current constraints include:

- the shell registry is still backed by `resources/js/app/pages/pageRegistryProvider.ts`
- page decoration still depends on current page conventions such as `layout`, `i18n`, and `getI18nScope`
- shell preload currently focuses on `common` and `layouts`, with feature scopes loaded later

These trade-offs are intentional. The shell is meant to concentrate application policy without turning the bootstrap layer or shared runtime layer into the architectural center of the frontend.
