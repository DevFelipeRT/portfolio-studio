# Initiatives (Frontend)

Scope: admin Inertia pages to manage initiatives (including translations and images), plus the public “initiative highlight list” CMS section implementation.

Evidence:

- Admin page registry: `resources/js/app/pages/initiatives/pages.ts`
- Admin pages: `resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/app/pages/initiatives/admin/create/page.tsx`, `resources/js/app/pages/initiatives/admin/edit/page.tsx`
- Admin UI components: `resources/js/modules/initiatives/ui/InitiativesTable.tsx`, `resources/js/modules/initiatives/ui/InitiativeOverlay.tsx`, `resources/js/modules/initiatives/ui/InitiativeForm.tsx`
- Translations: `resources/js/modules/initiatives/ui/TranslationModal.tsx`, `resources/js/modules/initiatives/core/api/translations.ts`
- CMS section registry + implementation: `resources/js/modules/initiatives/sectionRegistryProvider.ts`, `resources/js/modules/initiatives/ui/sections/InitiativeHighlightListSection.tsx`
- CMS template definition (data source binding): `resources/templates/initiatives/initiative_highlight_list/initiative_highlight_list.php`

## Admin UI (Inertia)

Pages are registered under keys like `initiatives/admin/Index` and rendered from the backend controller (`resources/js/app/pages/initiatives/pages.ts`, `app/Modules/Initiatives/Http/Controllers/InitiativeController.php`).

- Index lists initiatives and uses an overlay for read-only details (no `initiatives.show` page) (`resources/js/app/pages/initiatives/admin/index/page.tsx`, `resources/js/modules/initiatives/ui/InitiativeOverlay.tsx`).
- “Display” can be toggled via `initiatives.toggle-display` (`resources/js/app/pages/initiatives/admin/index/page.tsx`, `app/Modules/Initiatives/Routes/admin.php`).
- Create/edit pages submit multipart form data (images + fields) to `initiatives.store` / `initiatives.update` (`resources/js/app/pages/initiatives/admin/create/page.tsx`, `resources/js/app/pages/initiatives/admin/edit/page.tsx`).
- Edit uses `_method: 'put'` for update submissions (method spoofing) (`resources/js/app/pages/initiatives/admin/edit/page.tsx`).

### Images on initiatives

Existing images are displayed on the edit form, and new images can be submitted as part of create/update (`resources/js/modules/initiatives/ui/InitiativeForm.tsx`, `app/Modules/Initiatives/Http/Requests/Initiative/UpdateInitiativeRequest.php`).

No frontend interaction was found for deleting or editing existing images individually; updates replace the image collection when an `images[]` payload is submitted (`app/Modules/Initiatives/Application/UseCases/UpdateInitiative/UpdateInitiative.php`).

## Translations (modal UX)

The edit page includes a translations modal and performs locale conflict checks by loading existing translations, then using a swap dialog when selecting a locale that already exists (`resources/js/app/pages/initiatives/admin/edit/page.tsx`, `resources/js/modules/initiatives/core/api/translations.ts`).

Supported locales are fetched from `route('website-settings.locales')` (`resources/js/modules/initiatives/core/api/translations.ts`).

## CMS section: `initiative_highlight_list`

This module contributes a public section component to the Content Management renderer:

- Registry: `initiative_highlight_list` → `InitiativeHighlightListSection` (`resources/js/modules/initiatives/sectionRegistryProvider.ts`)
- Template data source: `initiatives.visible.v1` injected into section field `initiatives` and parameter-mapped from `max_items` → `limit` (`resources/templates/initiatives/initiative_highlight_list/initiative_highlight_list.php`)
- Renderer reads `initiatives` from section data and optionally applies `max_items` / `maxItems` client-side (`resources/js/modules/initiatives/ui/sections/InitiativeHighlightListSection.tsx`)

