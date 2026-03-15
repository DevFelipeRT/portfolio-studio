# i18n – Known Issues

This file tracks the problems and code risks that still matter in the current
`common/i18n` implementation. It intentionally does not repeat expected
behavior, authoring conventions, or architectural choices that are documented
in `docs/frontend/common/i18n/README.md`.

## 1) Missing key vs missing bundle is still difficult to diagnose quickly

### Problem
- A translation can resolve to fallback text or the raw key even when the source
  file exists in the repository.

### Why this happens
- The runtime failure mode is ambiguous:
  - the key may actually be missing from the loaded namespace, or
  - the namespace may never have been loaded for that locale because the scope
    was not declared or not preloaded.

### Why this matters
- Debugging gets slower because the visible symptom is the same for two
  different root causes.
- The current DEV warning path reports unresolved keys, but it does not tell us
  whether the namespace itself was absent.

### Current mitigation
- Verify the page scope first.
- Verify the registry id and the corresponding `definition.ts` / `environment.ts`
  pair.
- Only then verify the key inside the loaded namespace.

## 2) Scope ids are stringly-typed

### Problem
- Scope ids such as `projects`, `courses`, `layouts`, and dynamic scope names
  are still represented as plain strings throughout the API.

### Why this matters
- This does not create a bug by itself, but it weakens the codebase:
  - typos are detected only at runtime
  - invalid scope declarations can silently skip preload behavior
  - mistakes are easier to ship and harder to trace back to the declaration site

### Current impact
- A misspelled scope id can look like a preload problem, a missing translation,
  or a page-specific regression depending on where it is used.
- TypeScript does not currently guarantee that a declared scope id matches a
  real registered scope.

### Possible improvement
- Introduce a typed source of truth for scope ids and consume it from page
  declarations, registry definitions, and scope-aware helpers.

## 3) Locale switching may preload more than the current page strictly needs

### Problem
- Some locale-switch paths call `preloadI18nBundles(...)` without explicit
  `scopeIds`.

### Why this happens
- In that mode, the preloading layer targets every scope that is already
  registered in the singleton registry, not only the scopes required by the
  current page.

### Why this matters
- The amount of preload work depends on prior navigation history.
- Locale changes can load more translation data than the current screen
  strictly needs.

### Trade-off
- This behavior keeps the public API simple and can warm scopes that the user is
  likely to revisit soon.
- The cost is broader preload work and less predictable runtime behavior during
  locale switches.

### Possible improvement
- Pass explicit scope ids from every locale-switch call site that wants bounded
  work.
- Separate “common only” and “all registered scopes” into distinct public APIs.
