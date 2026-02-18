# Initiatives (Backend)

Scope: admin CRUD for initiatives, translations, locale-aware persistence, and public-facing “visible initiatives” exposure via a capability provider (for CMS rendering).

Evidence:

- Routes + wiring: `app/Modules/Initiatives/Routes/admin.php`, `app/Modules/Initiatives/Infrastructure/Providers/InitiativesServiceProvider.php`
- Controllers (admin): `app/Modules/Initiatives/Http/Controllers/InitiativeController.php`
- Controllers (translations / JSON): `app/Modules/Initiatives/Http/Controllers/InitiativeTranslationController.php`
- Models: `app/Modules/Initiatives/Domain/Models/Initiative.php`, `app/Modules/Initiatives/Domain/Models/InitiativeTranslation.php`
- Application layer: `app/Modules/Initiatives/Application/UseCases/*`, `app/Modules/Initiatives/Application/Services/*`
- Persistence: `database/migrations/2025_11_27_165214_create_initiatives_table.php`, `database/migrations/2026_02_04_090000_rename_initiative_description_columns.php`, `database/migrations/2026_02_04_091000_add_locale_to_initiatives.php`, `database/migrations/2026_02_04_092000_add_initiative_translations.php`
- Image pivot used by initiatives: `app/Modules/Initiatives/Domain/Models/Initiative.php`, `database/migrations/2025_12_16_191418_create_image_attachments_table.php`
- Capabilities: `app/Modules/Initiatives/Application/Capabilities/Providers/VisibleInitiatives.php`

## HTTP Surface

Routes are registered under `web + auth + verified` by `InitiativesServiceProvider` (`app/Modules/Initiatives/Infrastructure/Providers/InitiativesServiceProvider.php`).

### Admin routes

Declared in `app/Modules/Initiatives/Routes/admin.php`:

- Initiatives CRUD (no `show` route): `Route::resource('initiatives', InitiativeController::class)->except(['show'])->names('initiatives')`
- Toggle display:
  - `PATCH /admin/initiatives/{initiative}/toggle-display` (`initiatives.toggle-display`) → toggles `display` (`app/Modules/Initiatives/Http/Controllers/InitiativeController.php`)
- Translations:
  - `GET /admin/initiatives/{initiative}/translations` (`initiatives.translations.index`)
  - `POST /admin/initiatives/{initiative}/translations` (`initiatives.translations.store`)
  - `PUT /admin/initiatives/{initiative}/translations/{locale}` (`initiatives.translations.update`)
  - `DELETE /admin/initiatives/{initiative}/translations/{locale}` (`initiatives.translations.destroy`)

## Data model (persistence)

Initiatives are stored in `initiatives` and include `locale`, `name`, `summary`, `description`, `display`, and date fields (`database/migrations/2025_11_27_165214_create_initiatives_table.php`, `database/migrations/2026_02_04_090000_rename_initiative_description_columns.php`, `database/migrations/2026_02_04_091000_add_locale_to_initiatives.php`).

Translations are stored in `initiative_translations` (unique `(initiative_id, locale)`) (`database/migrations/2026_02_04_092000_add_initiative_translations.php`).

Initiatives can have images via the `image_attachments` morph pivot (`Initiative::images()` in `app/Modules/Initiatives/Domain/Models/Initiative.php`).

## Images behavior (replacement semantics)

Create/update requests accept an `images[]` payload (files + optional metadata). The use cases replace the initiative image collection when images are provided (`app/Modules/Initiatives/Http/Requests/Initiative/StoreInitiativeRequest.php`, `app/Modules/Initiatives/Http/Requests/Initiative/UpdateInitiativeRequest.php`, `app/Modules/Initiatives/Application/UseCases/CreateInitiative/CreateInitiative.php`, `app/Modules/Initiatives/Application/UseCases/UpdateInitiative/UpdateInitiative.php`).

## Locale + translations behavior

- Admin validation restricts `locale` to supported locales resolved via the capability key `website.locales.supported.v1` (`app/Modules/Initiatives/Application/Services/SupportedLocalesResolver.php`, `app/Modules/Initiatives/Http/Requests/Initiative/StoreInitiativeRequest.php`, `app/Modules/Initiatives/Http/Requests/Initiative/UpdateInitiativeRequest.php`).
- When changing an initiative base `locale` to a locale that already exists in translations, updates support a swap behavior controlled by `confirm_swap` (`app/Modules/Initiatives/Application/UseCases/UpdateInitiative/UpdateInitiative.php`, `app/Modules/Initiatives/Application/Services/InitiativeLocaleSwapService.php`).

## Capabilities (public data exposure)

The module registers `initiatives.visible.v1` via `VisibleInitiatives` (`app/Modules/Initiatives/Infrastructure/Providers/InitiativesServiceProvider.php`, `app/Modules/Initiatives/Application/Capabilities/Providers/VisibleInitiatives.php`).

This capability is used by Content Management templates as a data source: `initiative_highlight_list` binds `initiatives.visible.v1` into the section’s `initiatives` field (`resources/templates/initiatives/initiative_highlight_list/initiative_highlight_list.php`).

