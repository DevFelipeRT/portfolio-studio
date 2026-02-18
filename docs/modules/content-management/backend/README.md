# Content Management (Backend)

Scope: content-managed pages and sections, template registry/validation, locale-aware public rendering, and dynamic section enrichment (capabilities + images).

Evidence:

- Routes + provider wiring: `app/Modules/ContentManagement/Routes/admin.php`, `app/Modules/ContentManagement/Routes/public.php`, `app/Modules/ContentManagement/Infrastructure/Providers/ContentManagementServiceProvider.php`
- Public rendering: `app/Modules/ContentManagement/Http/Controllers/Public/PageRenderController.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`
- Admin management: `app/Modules/ContentManagement/Http/Controllers/Admin/PageController.php`, `app/Modules/ContentManagement/Http/Controllers/Admin/PageSectionController.php`, `app/Modules/ContentManagement/Http/Controllers/Admin/LocalesController.php`
- Core services: `app/Modules/ContentManagement/Application/Services/PageService.php`, `app/Modules/ContentManagement/Application/Services/PageSectionService.php`, `app/Modules/ContentManagement/Application/Services/ContentSettingsService.php`, `app/Modules/ContentManagement/Application/Services/PublicPageLocaleResolver.php`
- Templates: `app/Modules/ContentManagement/Domain/Templates/TemplateRegistry.php`, `app/Modules/ContentManagement/Config/content_management.php`, `app/Modules/ContentManagement/Config/templates.php`, `resources/templates/content-management/*`
- Template validation + translations: `app/Modules/ContentManagement/Application/Services/Templates/TemplateValidationService.php`, `app/Modules/ContentManagement/Application/Services/Templates/TemplateTranslationService.php`
- Persistence: `database/migrations/2025_12_10_162820_create_pages_table.php`, `database/migrations/2025_12_10_162900_create_page_sections_table.php`, `database/migrations/2025_12_22_200509_create_content_settings_table.php`
- Dynamic enrichment dependencies:
  - Capabilities gateway: `app/Modules/ContentManagement/Application/Capabilities/CapabilitiesGateway.php`, `app/Modules/ContentManagement/Application/Capabilities/SectionCapabilitiesDataFetcher.php`
  - Images on sections: `app/Modules/ContentManagement/Domain/Models/PageSection.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`, `config/image_owners.php`, `database/migrations/2025_12_16_191418_create_image_attachments_table.php`

## Architecture overview

Content pages (`Page`) are stored with a slug + locale and are composed of ordered `PageSection` records. Each section references a `template_key` and stores its template payload under `data` (`database/migrations/2025_12_10_162820_create_pages_table.php`, `database/migrations/2025_12_10_162900_create_page_sections_table.php`).

Templates are described declaratively (PHP arrays on disk) and compiled into an in-memory `TemplateRegistry` on boot (`app/Modules/ContentManagement/Infrastructure/Providers/ContentManagementServiceProvider.php`, `app/Modules/ContentManagement/Domain/Templates/TemplateRegistry.php`, `app/Modules/ContentManagement/Config/templates.php`).

Public rendering is Inertia-based: a route resolves a locale + page, then a presenter builds the page/sections payload and a template metadata payload for the frontend renderer (`app/Modules/ContentManagement/Http/Controllers/Public/PageRenderController.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`).

## HTTP Surface

All routes are registered under the `web` middleware group by `ContentManagementServiceProvider` (`app/Modules/ContentManagement/Infrastructure/Providers/ContentManagementServiceProvider.php`).

### Public routes

- `GET /` (`home`) → renders the configured “home slug” (`app/Modules/ContentManagement/Routes/public.php`, `app/Modules/ContentManagement/Http/Controllers/Public/PageRenderController.php`, `app/Modules/ContentManagement/Application/Services/ContentSettingsService.php`)
- `GET /content/{slug}` (`content.pages.show`) → renders by slug (`app/Modules/ContentManagement/Routes/public.php`, `app/Modules/ContentManagement/Http/Controllers/Public/PageRenderController.php`)

### Admin routes (auth + verified)

Pages:

- `GET /admin/content/pages` (`admin.content.pages.index`) (`app/Modules/ContentManagement/Routes/admin.php`, `app/Modules/ContentManagement/Http/Controllers/Admin/PageController.php`)
- `GET /admin/content/pages/create` (`admin.content.pages.create`)
- `POST /admin/content/pages` (`admin.content.pages.store`)
- `GET /admin/content/pages/{page}/edit` (`admin.content.pages.edit`)
- `PUT/PATCH /admin/content/pages/{page}` (`admin.content.pages.update`)
- `DELETE /admin/content/pages/{page}` (`admin.content.pages.destroy`)
- `POST /admin/content/pages/{page}/set-home` (`admin.content.pages.set-home`) (`app/Modules/ContentManagement/Http/Controllers/Admin/PageController.php`)

Locales:

- `GET /admin/content/locales` (`admin.content.locales.index`) → JSON list of locales present in pages (`app/Modules/ContentManagement/Http/Controllers/Admin/LocalesController.php`, `app/Modules/ContentManagement/Application/Services/PageService.php`)

Sections:

- `POST /admin/content/sections` (`admin.content.sections.store`)
- `PUT /admin/content/sections/{section}` (`admin.content.sections.update`)
- `DELETE /admin/content/sections/{section}` (`admin.content.sections.destroy`)
- `POST /admin/content/sections/{section}/toggle-active` (`admin.content.sections.toggle-active`)
- `POST /admin/content/sections/reorder` (`admin.content.sections.reorder`) (`app/Modules/ContentManagement/Http/Controllers/Admin/PageSectionController.php`)

## Persistence model

### `pages`

Key fields (migration evidence):

- `slug` + `locale` are unique (`pages_slug_locale_unique`) (`database/migrations/2025_12_10_162820_create_pages_table.php`)
- SEO fields: `meta_title`, `meta_description`, `meta_image_id` (FK to `images`, null-on-delete) (`database/migrations/2025_12_10_162820_create_pages_table.php`, `app/Modules/ContentManagement/Domain/Models/Page.php`)
- Publication flags: `is_published`, `published_at`, and `is_indexable` (`database/migrations/2025_12_10_162820_create_pages_table.php`)

### `page_sections`

Key fields (migration evidence):

- Template linkage: `template_key` + `data` (JSON) (`database/migrations/2025_12_10_162900_create_page_sections_table.php`)
- Layout: `slot` + `position` + `anchor` (`database/migrations/2025_12_10_162900_create_page_sections_table.php`)
- Visibility: `is_active`, `visible_from`, `visible_until` (`database/migrations/2025_12_10_162900_create_page_sections_table.php`)
- Optional locale override: `locale` (`database/migrations/2025_12_10_162900_create_page_sections_table.php`)

### `content_settings`

Global module state currently stores the `home_slug` used by the `home` route (`database/migrations/2025_12_22_200509_create_content_settings_table.php`, `app/Modules/ContentManagement/Application/Services/ContentSettingsService.php`).

## Template system

### Discovery and registry

Template definitions are loaded from a “templates tree” under `resources/templates/*/*/*.php` (origin/template files) and aggregated by `app/Modules/ContentManagement/Config/templates.php`.

- Origins are configurable via `content_management.template_origins` (`app/Modules/ContentManagement/Config/content_management.php`)
- Template origin auto-discovery supports:
  - a direct origin directory containing template folders, or
  - a parent path with nested origin directories (`app/Modules/ContentManagement/Config/templates.php`)
- Template keys must be globally unique across all origins; duplicates raise an exception at load time (`app/Modules/ContentManagement/Config/templates.php`)

The aggregated templates config is bound to `config('content_management.templates')` (`app/Modules/ContentManagement/Config/content_management.php`) and compiled into `TemplateRegistry` during service provider registration (`app/Modules/ContentManagement/Infrastructure/Providers/ContentManagementServiceProvider.php`, `app/Modules/ContentManagement/Domain/Templates/TemplateRegistry.php`).

### Template translations (labels and defaults)

Templates can use translation catalogs stored at:

`resources/templates/{origin}/{template}/locales/{locale}.php` (`app/Modules/ContentManagement/Application/Services/Templates/TemplateTranslationService.php`).

These catalogs are used when mapping templates to DTOs and when applying locale-specific default values (`app/Modules/ContentManagement/Application/Services/Templates/TemplateValidationService.php`).

### Validation and normalization

`TemplateValidationService` derives Laravel validation rules from template fields and normalizes missing field values using defaults (including locale-dependent defaults via translation keys) (`app/Modules/ContentManagement/Application/Services/Templates/TemplateValidationService.php`).

## Public rendering pipeline

High-level flow:

1. Determine locale for the request (home or slug) using `PublicPageLocaleResolver` (checks website-locale signals and whether a page exists for candidate locales) (`app/Modules/ContentManagement/Application/Services/PublicPageLocaleResolver.php`).
2. Load page + visible sections, then build payloads in `PagePresenter` (`app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`).
3. Render Inertia page `content-management/public/RenderedPage` with:
   - `page`
   - `sections`
   - `extra.templates` (template definitions used by the sections)
   - `extra.seo` (meta payload) (`app/Modules/ContentManagement/Http/Controllers/Public/PageRenderController.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`).

### Dynamic enrichment: capabilities

Templates may declare a “data source” of type `capability` (capability key + parameter mapping + target field) (`app/Modules/ContentManagement/Domain/Templates/TemplateDataSource.php`, `app/Modules/ContentManagement/Domain/Templates/TemplateRegistry.php`).

`PagePresenter` detects these data sources and uses `SectionCapabilitiesDataFetcher` to batch-execute capability calls and inject results into each section’s `data[target_field]` (`app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`, `app/Modules/ContentManagement/Application/Capabilities/SectionCapabilitiesDataFetcher.php`).

### Dynamic enrichment: images

Sections can reference images via the shared `image_attachments` pivot using the field name as the pivot `slot` (see `PageSection::images()` pivot fields and `PagePresenter::enrichSectionsWithImages`) (`app/Modules/ContentManagement/Domain/Models/PageSection.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`, `database/migrations/2025_12_20_164054_add_slot_to_image_attachments_table.php`).

## Ordering constraints (hero sections)

`PageSectionService` enforces a domain rule for the `hero` slot: hero sections must appear first when ordering sections (`app/Modules/ContentManagement/Application/Services/PageSectionService.php`).

