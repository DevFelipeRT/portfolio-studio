# Frontend Common Page Runtime

This document describes the shared frontend page runtime located at `resources/js/common/page-runtime`.

## Overview

The `common/page-runtime` module centralizes the frontend runtime surface that most of the application needs for page delivery:

- reading the current page object
- reading current page props
- navigating between pages
- rendering page links
- updating the document head
- creating page forms backed by the current runtime

Its goal is not to replace Inertia today. Its goal is to keep most of the frontend from importing Inertia directly, so the concrete page delivery technology stays behind a stable shared API.

Primary evidence:

- `resources/js/common/page-runtime/index.ts`
- `resources/js/common/page-runtime/runtimeAdapter.ts`
- `resources/js/common/page-runtime/adapters/inertia/createInertiaAdapter.ts`
- `resources/js/common/page-runtime/adapters/inertia/useInertiaPageForm.ts`

## Responsibilities

The module owns the technical page runtime abstraction for shared frontend code.

It is responsible for:

- exposing a stable public facade for page runtime concerns
- hiding direct imports from `@inertiajs/react` and `@inertiajs/core`
- adapting the runtime-specific APIs to project-level generic names
- giving `common/*`, layouts, pages, and feature modules a single import boundary

It is not responsible for:

- project-specific locale policy
- page title policy
- application shell composition
- page registry orchestration
- Inertia boot and page resolution

Those concerns now live outside this module under `resources/js/app/shell/*` and `resources/js/app/bootstrap/*`.

## Module structure

The module is organized into the following layers:

- `resources/js/common/page-runtime/index.ts`: public facade consumed by the rest of the frontend
- `resources/js/common/page-runtime/types/*`: runtime-neutral public contracts
- `resources/js/common/page-runtime/page/*`: hooks for current page metadata and props
- `resources/js/common/page-runtime/navigation/*`: runtime-neutral link component and router facade
- `resources/js/common/page-runtime/document/*`: runtime-neutral head component
- `resources/js/common/page-runtime/forms/*`: runtime-neutral form hook facade
- `resources/js/common/page-runtime/adapters/inertia/*`: the concrete Inertia adapter implementation
- `resources/js/common/page-runtime/runtimeAdapter.ts`: singleton adapter resolver

## Public API surface

The public surface exported by `resources/js/common/page-runtime/index.ts` includes:

- `PageHead`
- `PageLink`
- `pageRouter`
- `useCurrentPage`
- `usePageComponentName`
- `usePageForm`
- `usePageProps`

It also exports runtime-neutral types such as:

- `RuntimePage`
- `RuntimePageProps`
- `PageVisitOptions`
- `PageRouter`
- `PageFormDataValues`
- `PageFormHook`

The intended import path for consumers is:

```ts
import {
  PageHead,
  PageLink,
  pageRouter,
  useCurrentPage,
  usePageForm,
  usePageProps,
} from '@/common/page-runtime';
```

## Adapter strategy

The module currently uses a simple singleton adapter model.

`resources/js/common/page-runtime/runtimeAdapter.ts` lazily instantiates the default adapter once and reuses it for all consumers during the session.

The current default adapter is the Inertia adapter:

- `createInertiaAdapter()` wires `Head`, `Link`, `router`, `usePage`, and `useForm`
- runtime-specific imports are intentionally contained inside `resources/js/common/page-runtime/adapters/inertia/*`

This keeps the first iteration simple while still creating a clean boundary for future runtime changes.

## Inertia adapter

The concrete Inertia adapter is implemented under `resources/js/common/page-runtime/adapters/inertia`.

Current responsibilities by file:

- `createInertiaAdapter.ts`: assembles the adapter object
- `InertiaPageHead.tsx`: wraps Inertia `Head`
- `InertiaPageLink.tsx`: wraps Inertia `Link`
- `inertiaPageRouter.ts`: adapts `router.visit/get/post/put/patch/delete`
- `useInertiaCurrentPage.ts`: maps `usePage()` to `RuntimePage`
- `useInertiaPageProps.ts`: maps `usePage().props` to `usePageProps`
- `useInertiaPageForm.ts`: maps Inertia `useForm` to the shared `usePageForm` contract

In practice, this means `@inertiajs/react` and `@inertiajs/core` are now concentrated in one dedicated shared boundary instead of leaking broadly across shared code and layout code.

## Current consumers

This first delivery already migrated a small set of real consumers to the new facade.

Examples:

- `resources/js/app/layouts/GuestLayout.tsx`
- `resources/js/app/layouts/PublicLayout.tsx`
- `resources/js/app/layouts/AuthenticatedLayout.tsx`
- `resources/js/app/layouts/partials/Header.tsx`
- `resources/js/app/layouts/partials/UserMenu.tsx`
- `resources/js/app/navigation/menu/desktop/items/DesktopLinkItem.tsx`
- `resources/js/app/navigation/menu/mobile/items/MobileLinkItem.tsx`
- `resources/js/common/forms/partials/FormActions.tsx`
- `resources/js/common/forms/hooks/useFormSubmit.ts`
- `resources/js/modules/contact-channels/ui/sections/ContactPrimarySection.tsx`

This keeps the migration incremental and demonstrates the new runtime boundary across `head`, `link`, `router`, `page props`, and `form` use cases.

## Forms contract

`usePageForm(...)` intentionally mirrors only the subset of Inertia form behavior that the project currently needs through the shared API.

The current shared form contract includes:

- `data`
- `setData`
- `errors`
- `processing`
- `recentlySuccessful`
- `isDirty`
- `hasErrors`
- `reset`
- `clearErrors`
- `setDefaults`
- `transform`
- `post`
- `put`
- `patch`
- `delete`

At this stage, the contract is intentionally compatibility-driven rather than exhaustive. The goal is to cover real project usage while keeping the shared facade understandable and easy to evolve.

## Navigation contract

`pageRouter` exposes a runtime-neutral router contract for the operations already used throughout the project:

- `visit`
- `get`
- `post`
- `put`
- `patch`
- `delete`

The current options shape includes the behaviors already used by the application, such as:

- `preserveState`
- `preserveScroll`
- `replace`
- `forceFormData`
- `headers`
- `only`
- `except`
- lifecycle callbacks such as `onSuccess`, `onError`, and `onFinish`

This API is intentionally a practical first pass. It is designed around current project usage, not full one-to-one exposure of the Inertia router surface.

## Relationship to `app/shell` and `app/bootstrap`

Today the separation is:

- `common/page-runtime`: technical page runtime facade for shared consumption
- `app/shell`: application-specific runtime policy, localization context, title policy, and page decoration
- `app/bootstrap`: browser boot, initial page reading, and minimal Inertia wiring

This split keeps the adapter boundary reusable while the app shell stays independent from direct `@inertiajs/react` imports.

## Authoring guidance

When adding new shared/frontend code that needs page runtime features:

1. Prefer imports from `@/common/page-runtime`.
2. Use `usePageProps` when the code only needs props.
3. Use `useCurrentPage` when the code also needs metadata such as `component` or `url`.
4. Use `PageLink` instead of importing Inertia `Link` directly.
5. Use `PageHead` instead of importing Inertia `Head` directly.
6. Use `pageRouter` instead of importing Inertia `router` directly.
7. Use `usePageForm` instead of importing Inertia `useForm` directly when the shared contract is sufficient.

This helps keep new code aligned with the intended architecture and reduces new direct dependencies on Inertia.

## Current limitations and trade-offs

The module is intentionally minimal in this first iteration.

Current constraints include:

- the default adapter is still statically bound to Inertia
- `usePageForm` currently focuses on the subset of behavior needed by migrated consumers
- some project areas still import Inertia directly and will be migrated gradually
- the application shell and localization policy are intentionally outside this module
- the default adapter is still statically bound to Inertia even though app policy moved to `app/shell`

These trade-offs are intentional. The current goal is to establish a clean technical boundary and enable safe incremental migration.
