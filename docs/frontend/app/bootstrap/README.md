# Frontend App Bootstrap

This document describes the browser bootstrap layer located at `resources/js/app/bootstrap`.

## Overview

The `app/bootstrap` module is the infrastructural entrypoint for the web application.

It is responsible for:

- reading the initial page payload embedded by Laravel
- initializing the application shell before the first mount
- creating the Inertia React app
- resolving page names through the shell registry
- mounting the root React tree into the DOM

Primary evidence:

- `resources/js/app.tsx`
- `resources/js/app/bootstrap/index.ts`
- `resources/js/app/bootstrap/bootApplication.tsx`
- `resources/js/app/bootstrap/readInitialPage.ts`
- `resources/js/app/bootstrap/createPageComponentResolver.tsx`

## Responsibilities

This layer owns browser boot orchestration.

It is responsible for:

- connecting the root frontend entrypoint to the current page runtime
- keeping the minimum `@inertiajs/react` wiring required by the app
- handing the shell a typed initial page payload before mount
- delegating page decoration and app policy to `app/shell`

It is not responsible for:

- localization policy
- title rendering policy
- layout composition
- page i18n scoping
- page registry authoring

Those concerns live in `resources/js/app/shell/*` and `resources/js/app/pages/*`.

## Module structure

The module is intentionally small:

- `resources/js/app/bootstrap/index.ts`: public bootstrap facade
- `resources/js/app/bootstrap/bootApplication.tsx`: boot orchestration, `createInertiaApp(...)`, mount, and progress config
- `resources/js/app/bootstrap/readInitialPage.ts`: reads `<script id="inertia-page">` and parses the serialized page JSON
- `resources/js/app/bootstrap/createPageComponentResolver.tsx`: resolves page keys from the shell registry and decorates the loaded page component

## Boot flow

The current browser boot sequence is:

1. `resources/js/app.tsx` imports `bootApplication()` from `@/app/bootstrap`.
2. `readInitialPage()` parses the initial Inertia page payload from the root Blade shell.
3. `initializeShell(...)` runs app policy setup before the first mount.
4. `createInertiaApp(...)` is called with:
   - the parsed initial page
   - `resolveDocumentTitle`
   - a page resolver created from `getPageRegistry()`
5. The `setup(...)` callback mounts the React app.
6. The shell-decorated page component synchronizes runtime state from live page props during each render, including client-side navigations.

Evidence:

- `resources/js/app.tsx`
- `resources/js/app/bootstrap/bootApplication.tsx`
- `resources/views/app.blade.php`

## Public API surface

The public surface exported by `resources/js/app/bootstrap/index.ts` is intentionally minimal:

- `bootApplication`

The intended import path for the app entrypoint is:

```ts
import { bootApplication } from '@/app/bootstrap';
```

## Relationship to `app/shell`

`app/bootstrap` depends on `app/shell`, but `app/shell` must not depend on `app/bootstrap`.

Today the separation is:

- `app/bootstrap`: browser wiring and framework integration
- `app/shell`: application policy and page composition

This keeps the shell conceptually stable even if the runtime technology or boot shape changes later.

## Authoring guidance

When changing this layer:

1. Keep it small and orchestration-focused.
2. Prefer delegating policy decisions to `@/app/shell`.
3. Keep direct `@inertiajs/react` usage contained here instead of reintroducing it into `app/shell`.
4. Treat page-payload parsing and mount errors as infrastructure concerns, not app-policy concerns.

## Current trade-offs

Current constraints include:

- the bootstrap still knows that the concrete runtime is Inertia
- the initial page is currently read from a script element, matching the CSR-first architecture

These trade-offs are intentional. The layer is meant to stay thin while giving the rest of the application a technology-neutral architectural vocabulary.
