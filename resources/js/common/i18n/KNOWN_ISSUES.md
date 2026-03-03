# i18n – Known issues / tradeoffs

This folder contains an i18n system composed of:
1) a global app i18n environment (`createI18nEnvironment(...)`) used by the React provider, and
2) module-level translation providers (each backed by `import.meta.glob(...)`), coordinated by the i18n registry.

The current design intentionally optimizes for incremental migration (scoped preloading and decoupling the Inertia wrapper from module imports) but still has important tradeoffs.

## 1) Translations can run before catalogs are preloaded

### Symptom
- On first render (or when navigating between pages), some strings may briefly render as the raw key (or fallback text) before the relevant translation catalogs are loaded.

### Root cause
- Many modules translate using their own module-level translator (e.g. `contactChannelsTranslator.translate(...)`) rather than using the `I18nContext` translator from the app provider.
- The module translator reads from its module provider cache; if that cache does not yet have `loadedCatalogs[locale]`, it cannot resolve a translation tree and returns the key.

### Why it’s currently expected
- The global React provider gate only preloads catalogs through the preloader(s) that were included in the page scope.
- When we render immediately (no blocking loading fallback), there is no UI-level guarantee that module catalogs are ready before components call module translators.

### Mitigation options
- Reintroduce a UI gate (blocking or overlay) until the scoped preloads complete.
- Add local gates around dynamic features/modules (e.g. CMS section rendering) so that a module preloads itself before translating.
- Migrate module hooks to translate through `I18nContext` (requires namespace strategy if catalogs are unified).

## 2) DEV warning: `Catalog for locale "…" is not loaded yet.`

### Symptom
- Console warning emitted from `createTranslatorProviderFromLoaders(...).getCatalog(locale)` in DEV.

### Root cause
- A module translator is used before its provider preloaded that locale’s catalogs.

### Notes
- This warning is useful when the UI is gated, but becomes noisy when rendering immediately.

### Mitigation options
- Keep the warning but ensure scope is correct and the UI waits for preload.
- Downgrade/suppress this warning in DEV when running in a non-blocking strategy.
- Ensure dynamic pages (e.g. CMS rendered pages) derive their i18n scope from runtime data (sections), so the right preloaders are included.

## 3) Scoped preload granularity is module-level (not per section/namespace)

### Symptom
- Activating an i18n scope id (e.g. `projects`) preloads all catalogs for that module and locale, even if only one section/namespace is rendered.

### Root cause
- The module provider preloader is built from a Vite glob and preloads all namespaces for a locale within that provider.

### Mitigation options
- Introduce sub-scopes (per namespace group) and split providers/loaders accordingly.
- Maintain separate loaders/providers for “heavy” namespaces and activate them only when needed.

## 4) Behavior/config divergence between global and module translators

### Symptom
- Fallback locale behavior and missing-key reporting may differ between global translations and module translations.

### Root cause
- The app-level translator is created with runtime config (e.g. `fallbackLocale` and `onMissingKey` in `createI18nEnvironment(...)`).
- Module translators are often created with `createTranslator({})`, so they do not automatically inherit runtime fallback or missing-key behavior.

### Mitigation options
- Stop creating module translators as constants; create them from the runtime config (or from `I18nContext`) instead.
- Standardize translator creation so module translators receive the same config as the global translator.

## 5) Registry definitions are stringly-typed

### Symptom
- A typo in a scope id (e.g. `Page.i18n = ['course']`) results in missing preloads.

### Root cause
- Scope ids are plain strings and currently enforced at runtime.
- The registry can ensure an id is defined/registered at runtime, but TypeScript cannot validate ids without a typed contract.

### Mitigation options
- Export a typed constant map of ids (e.g. `I18N_SCOPE_IDS`) and use it everywhere.
- Add stricter DEV-time assertions (throw on unknown ids) to fail fast.

## 6) Convention required for dynamic definition loading

### Symptom
- For on-demand resolution, each module/layout with i18n must provide a definition file under `i18n/definition.ts`.

### Root cause
- `createI18nRegistry()` loads all `*/i18n/definition.ts` modules via `import.meta.glob(...)` (non-eager) to populate `define(id, loader)`.

### Mitigation options
- Keep the convention (simple and scalable) and document it as part of module authoring.
- Replace with an explicit, centralized bootstrap import list (rejected earlier as too coupled).
- Generate definitions automatically (build step) if the project ever adopts codegen.

