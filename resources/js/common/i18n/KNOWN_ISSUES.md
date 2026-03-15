# i18n – Issues, limitations, and trade-offs

This module currently uses:
1. an `i18next` runtime,
2. shared preloaders for `common` and `layouts`,
3. scope-level preloaders coordinated by the preloading layer over the registry, and
4. an optional local gate for subtrees that must wait for scoped bundles.

The points below reflect the current state of the implementation.

## Issues

## 1) Missing key vs missing bundle is still hard to distinguish quickly

### Symptom
- A translation may resolve to fallback text or the key itself even when the source file exists.

### Why it still happens
- The underlying problem may be:
  - an actual missing key, or
  - a scope that was never loaded for that locale.

### Current state
- DEV warnings come from `missingKeyHandler`, so they report unresolved keys but do not explicitly tell you whether the namespace was absent because the bundle never loaded.

### Mitigation
- Verify the page scope first.
- Verify registry ids and `definition.ts` registration.
- Then verify the key inside the loaded namespace.

## Limitations

## 2) Scope ids are still stringly-typed

### Limitation
- Scope ids such as `projects`, `courses`, `layouts`, and dynamic ids are still plain strings.

### Impact
- Typos are caught only at runtime.
- TypeScript does not currently guarantee that a declared scope id is valid.

### Possible improvement
- Introduce a typed constant map for scope ids and consume it everywhere.

## 3) Dynamic definition loading still depends on convention and side effects

### Limitation
- Modules/layouts must expose `i18n/definition.ts` so the registry can resolve them on demand.
- Those definition modules must then import an `environment.ts` that registers the preloader by side effect.

### Impact
- If a module forgets this convention, runtime preload resolution breaks for that scope.

### Possible improvement
- Keep the convention documented and enforced in reviews, or generate registry definitions automatically in the future.

## Trade-offs

## 4) Scoped preload granularity is module-level

### Trade-off
- Enabling a scope id preloads all bundles for that scope and locale, not only the exact namespace used by the current subtree.

### Benefit
- Simpler registry model.
- Less orchestration complexity.
- Easier module authoring.

### Cost
- More data may be loaded than strictly necessary for a given render path.

### Possible improvement
- Introduce finer-grained sub-scopes for large modules.

## 5) Locale switching may preload more than the current page strictly needs

### Trade-off
- Some runtime paths call `preloadI18nBundles(...)` without `scopeIds`.
- In that mode, the preloading layer targets all preloaders that are already registered in the singleton registry, not only the current page scope.

### Benefit
- Locale changes can warm bundles that were already discovered earlier in the session.
- The API stays simple for callers that only need "shared runtime first".

### Cost
- The amount of work done during a locale change depends on prior navigation history.
- This can preload more data than the current screen strictly requires.

### Possible improvement
- Pass explicit scope ids from every call site that wants bounded work.
- Separate "common only" and "all registered scopes" into distinct public APIs.

## 6) Namespace strategy is scope-prefixed

### Trade-off
- Namespaces are addressed as `<scopeId>.<namespace>`.

### Benefit
- Avoids collisions between modules.
- Keeps bundles isolated by scope.

### Cost
- It is easy to target the wrong namespace when migrating code manually.

### Possible improvement
- Keep scope-local hooks such as `useProjectsTranslation(...)` and `useLayoutsTranslation(...)`.
- Consider typed scope/namespace maps if the matrix grows.
