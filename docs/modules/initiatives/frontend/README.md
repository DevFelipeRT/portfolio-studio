# Initiatives (Frontend)

Scope: admin Inertia pages to manage initiatives (including translations and images), plus the public “initiative highlight list” CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/initiatives/pages.ts`
- Admin pages: `resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/app/pages/initiatives/admin/create/page.tsx`, `resources/js/app/pages/initiatives/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/initiatives/ui/table/InitiativesTable.tsx`, `resources/js/modules/initiatives/ui/overlay/InitiativeOverlay.tsx`, `resources/js/modules/initiatives/ui/form/initiative/InitiativeForm.tsx`
- Shared table helpers used by the index: `resources/js/common/table/partials/TableCard.tsx`, `resources/js/common/table/partials/TablePagination.tsx`, `resources/js/common/table/query.ts`
- Translations: `resources/js/modules/initiatives/ui/translation-modal/TranslationModal.tsx`, `resources/js/modules/initiatives/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/initiatives/sectionRegistryProvider.ts`, `resources/js/modules/initiatives/ui/sections/InitiativeHighlightListSection.tsx`
- CMS template definition (data source binding): `resources/templates/initiatives/initiative_highlight_list/initiative_highlight_list.php`

## Admin UI (Inertia)

Pages are registered under keys like `initiatives/admin/Index` and rendered from the backend controller (`resources/js/app/pages/initiatives/pages.ts`, `app/Modules/Initiatives/Http/Controllers/InitiativeController.php`).

- Index lists initiatives and uses an overlay for read-only details (no `initiatives.show` page); the overlay now lazy-loads its detail payload from `initiatives.details` instead of reusing the row payload as a pseudo-detail object (`resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/modules/initiatives/ui/overlay/InitiativeOverlay.tsx`, `resources/js/modules/initiatives/core/api/details.ts`).
- The index page owns the visible heading/description/stats and now passes the create CTA through `TableCard.header`; the table no longer owns page-level copy (`resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/modules/initiatives/ui/InitiativeHeader.tsx`, `resources/js/modules/initiatives/ui/table/InitiativesTable.tsx`).
- The admin table uses the shared `resources/js/common/table` primitives for card shell, header slot, interactive rows, row actions, detail dialog, and `TablePagination`, while keeping initiative-specific rendering inside the module; the visible table/filter/badge copy now follows the shared `Visibility` / `Public` / `Private` vocabulary even though the internal flag remains `display` (`resources/js/modules/initiatives/ui/table/InitiativesTable.tsx`, `resources/js/modules/initiatives/ui/table/InitiativesRow.tsx`, `resources/js/modules/initiatives/ui/overlay/InitiativeOverlay.tsx`).
- The list is driven by a paginated backend contract and now intentionally uses a lightweight row type (`InitiativeListItem`) with `image_count` instead of a full `images[]` payload. The page keeps local state limited to filter inputs plus the selected row item, while the header reads counts from `initiatives.total` and the dedicated `visible_count` payload (`resources/js/modules/initiatives/core/types.ts`, `app/Modules/Initiatives/Http/Controllers/InitiativeController.php`, `app/Modules/Initiatives/Application/UseCases/ListInitiatives/ListInitiatives.php`, `app/Modules/Initiatives/Infrastructure/Repositories/InitiativeRepository.php`).
- The admin index supports server-driven sorting for `Name`, `Date / Period`, `Visibility`, and `Images`, plus filtering by image presence (`with` / `without` images) alongside search and visibility filters. Empty-state copy is now filter-aware, so the table distinguishes true onboarding from zero-result searches (`resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/modules/initiatives/ui/table/InitiativesTable.tsx`, `app/Modules/Initiatives/Http/Controllers/InitiativeController.php`, `app/Modules/Initiatives/Infrastructure/Repositories/InitiativeRepository.php`).
- That search contract is locale-aware as well: the backend filters against the same resolved `name` / `summary` content shown by the table row, using locale first, fallback second, and the base record last (`app/Modules/Initiatives/Infrastructure/Repositories/InitiativeRepository.php`, `app/Modules/Initiatives/Presentation/Presenters/InitiativeAdminPresenter.php`).
- Visibility can still be toggled through `initiatives.toggle-display`, while the admin UI presents the action as making an item public or private (`resources/js/app/pages/initiatives/admin/index/page.tsx`, `app/Modules/Initiatives/Routes/admin.php`).
- The index controller clamps invalid `page` requests back to the last valid page, which protects the shared table footer and empty state from out-of-range paginator payloads after mutations or manual URLs (`app/Modules/Initiatives/Http/Controllers/InitiativeController.php`).
- Create/edit pages submit multipart form data (images + fields) to `initiatives.store` / `initiatives.update` (`resources/js/app/pages/initiatives/admin/create/page.tsx`, `resources/js/app/pages/initiatives/admin/edit/page.tsx`).
- Edit uses `_method: 'put'` for update submissions (method spoofing) (`resources/js/app/pages/initiatives/admin/edit/page.tsx`).

### Images on initiatives

Existing images are displayed on the edit form, and new images can be submitted as part of create/update (`resources/js/modules/initiatives/ui/form/initiative/InitiativeForm.tsx`, `app/Modules/Initiatives/Http/Requests/Initiative/UpdateInitiativeRequest.php`).

No frontend interaction was found for deleting or editing existing images individually; updates replace the image collection when an `images[]` payload is submitted (`app/Modules/Initiatives/Application/UseCases/UpdateInitiative/UpdateInitiative.php`).

## Translations (modal UX)

The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/initiatives/admin/edit/page.tsx`, `resources/js/modules/initiatives/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/initiatives/core/api/translations.ts`).

## CMS section: `initiative_highlight_list`

This module contributes a public section component to the Content Management renderer:

- Registry: `initiative_highlight_list` → `InitiativeHighlightListSection` (`resources/js/modules/initiatives/sectionRegistryProvider.ts`)
- Template data source: `initiatives.visible.v1` injected into section field `initiatives` and parameter-mapped from `max_items` → `limit` (`resources/templates/initiatives/initiative_highlight_list/initiative_highlight_list.php`)
- Renderer reads `initiatives` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/initiatives/ui/sections/InitiativeHighlightListSection.tsx`)
