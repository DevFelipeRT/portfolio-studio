# i18n – Issues, limitations, and trade-offs

This module currently uses:
1. an `i18next` runtime,
2. shared preloaders for `common` and `layouts`,
3. scope-level preloaders coordinated by the i18n registry, and
4. local gating for dynamic areas that must wait for scoped catalogs.

The points below reflect the current state of the implementation.

## Issues

## 1) Scoped translation loading can still be missed outside gated flows

### Symptom
- A feature can still render fallback text or raw keys if it depends on a scoped catalog and does not preload or gate that scope correctly.

### Current state
- This is no longer a blanket app-wide issue.
- The shell (`common` + `layouts`) is preloaded before mount.
- `RenderedPage` also has scoped preload + gate behavior.
- The issue still exists as a risk for any other feature/module that renders before its scope is ready.

### Why it still happens
- The architecture does not globally block all page rendering on all possible scope ids.
- Scoped bundles are still loaded asynchronously.

### Mitigation
- Use `I18nScopeGate` around dynamic scope-heavy subtrees.
- Preload the page scope before locale reload when the route depends on scoped catalogs.
- Keep scope declaration correct via `Page.i18n` or `Page.getI18nScope`.

## 2) Missing key vs missing bundle is still hard to distinguish quickly

### Symptom
- A translation may resolve to fallback text or the key itself even when the source file exists.

### Why it still happens
- The underlying problem may be:
  - an actual missing key, or
  - a scope that was never loaded for that locale.

### Current state
- DEV warnings help, but they still do not fully separate these two failure modes.

### Mitigation
- Verify the page scope first.
- Verify registry ids and `definition.ts` registration.
- Then verify the key inside the loaded namespace.

## Limitations

## 3) Scope ids are still stringly-typed

### Limitation
- Scope ids such as `projects`, `courses`, `layouts`, and dynamic ids are still plain strings.

### Impact
- Typos are caught only at runtime.
- TypeScript does not currently guarantee that a declared scope id is valid.

### Possible improvement
- Introduce a typed constant map for scope ids and consume it everywhere.

## 4) Dynamic definition loading still depends on convention

### Limitation
- Modules/layouts must expose `i18n/definition.ts` so the registry can resolve them on demand.

### Impact
- If a module forgets this convention, runtime preload resolution breaks for that scope.

### Possible improvement
- Keep the convention documented and enforced in reviews, or generate registry definitions automatically in the future.

## Trade-offs

## 5) Scoped preload granularity is module-level

### Trade-off
- Enabling a scope id preloads all catalogs for that scope and locale, not only the exact namespace used by the current subtree.

### Benefit
- Simpler registry model.
- Less orchestration complexity.
- Easier module authoring.

### Cost
- More data may be loaded than strictly necessary for a given render path.

### Possible improvement
- Introduce finer-grained sub-scopes for large modules.

## 6) Namespace strategy is scope-prefixed

### Trade-off
- Namespaces are addressed as `<scopeId>.<namespace>`.

### Benefit
- Avoids collisions between modules.
- Keeps catalogs isolated by scope.

### Cost
- It is easy to target the wrong namespace when migrating code manually.

### Possible improvement
- Keep scope-local hooks such as `useProjectsTranslation(...)` and `useLayoutsTranslation(...)`.
- Consider typed scope/namespace maps if the matrix grows.

## 7) The system favors incremental migration over a fully blocking global bootstrap

### Trade-off
- The app does not globally block every page until every possible scoped catalog is loaded.

### Benefit
- Faster shell startup.
- Lower coupling between app bootstrap and modules.
- Better incremental migration path.

### Cost
- Dynamic areas still require local preload/gate discipline.
- Some correctness depends on the page declaring its i18n scope properly.
