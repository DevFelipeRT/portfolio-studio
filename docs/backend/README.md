# Backend Overview

This document is an overview of cross-cutting backend architecture and conventions. Module-specific behavior (routes, payloads, UI contracts) is documented under [`docs/modules/`](../modules/).

## Tech stack (evidence-based)

- Framework: Laravel (`composer.json`, `bootstrap/app.php`)
- Language: PHP 8.2+ (`composer.json`)
- Inertia server adapter: `inertiajs/inertia-laravel` (`composer.json`)
- Route name helper for the client: Ziggy (`tightenco/ziggy`) (`composer.json`, `resources/views/app.blade.php`)

## Entry points and composition

- HTTP entry: `public/index.php`
- Application bootstrap (routing + middleware): `bootstrap/app.php`
- Module provider registration: `app/Providers/AppServiceProvider.php`

## Architecture (modular monolith)

The backend is organized as a modular monolith. Modules live under `app/Modules/*` and commonly use a layered structure:

- `Application/`: use cases, DTOs, application services
- `Domain/`: Eloquent models and domain abstractions (e.g. repository interfaces)
- `Http/`: controllers, form requests, middleware, input mappers
- `Infrastructure/`: module service providers and repository implementations
- `Presentation/`: mappers/presenters (Inertia payload shaping)

Evidence: module layout under `app/Modules/*` and provider wiring in `app/Providers/AppServiceProvider.php`.

## Routing model (core + module routes)

- Core endpoints live in `routes/web.php` (e.g. locale persistence, contact form submission, admin dashboard).
- Each module loads routes from `app/Modules/*/Routes/*.php` inside its service provider, typically under `web`, and admin areas commonly add `auth` + `verified`. Evidence: `routes/web.php`, `bootstrap/app.php`, `app/Modules/*/Infrastructure/Providers/*ServiceProvider.php`.

## Runtime infrastructure (defaults)

- Database: default connection is `mysql` via `DB_CONNECTION` (`config/database.php`).
- Queue: default connection is `database` via `QUEUE_CONNECTION` (`config/queue.php`).
- Local dev script runs web server + queue listener + log viewer + Vite concurrently (`composer.json`).

## Database seeding (local dev/demo)

The repository includes deterministic seeders for local development and UI previews:

- Seeding guide: [`docs/backend/seeding.md`](seeding.md) (`database/seeders/*`)

## Inertia integration (shared props)

Inertia middleware is appended to the `web` middleware stack in `bootstrap/app.php`:

- `App\Modules\Inertia\Http\Middleware\HandleInertiaRequests`

That middleware shares common props (auth user, Ziggy routes, website settings, localization metadata) for all Inertia responses and also applies route-aware locale behavior for public content routes. Evidence: `bootstrap/app.php`, `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`.

## Localization (public vs system locale)

Two locale concepts are used:

- **Public locale** (site visitor): persisted via `POST /set-locale` and stored in a cookie configured in `config/localization.php` (`routes/web.php`, `app/Modules/WebsiteSettings/Http/Controllers/PublicLocaleController.php`).
- **System locale** (authenticated/admin UX): persisted via `POST /system/locale` and stored in a secure cookie configured in `config/localization.php` (`routes/web.php`, `app/Modules/SystemLocale/Http/Controllers/SystemLocaleController.php`).

## Translations + locale swap pattern

Several “portfolio data” modules implement the same pattern:

- Base records store a `locale` column.
- Translations are stored in `{entity}_translations` tables keyed by `(entity_id, locale)`.
- Admin updates accept `confirm_swap` to optionally swap base content with an existing translation when changing the base locale.

Evidence examples:

- Swap services + update use cases: `app/Modules/Projects/Application/Services/ProjectLocaleSwapService.php`, `app/Modules/Initiatives/Application/Services/InitiativeLocaleSwapService.php`, `app/Modules/Courses/Application/Services/CourseLocaleSwapService.php`
- `confirm_swap` mapping: `app/Modules/*/Http/Mappers/*InputMapper.php`

## Images: shared `image_attachments` pivot

Images are attached to different owners via a shared morph pivot table (`image_attachments`). Modules such as Projects and Initiatives model this via `images()` morph relations and update image collections through module-level image services. Evidence: `database/migrations/2025_12_16_191418_create_image_attachments_table.php`, `app/Modules/Projects/Domain/Models/Project.php`, `app/Modules/Initiatives/Domain/Models/Initiative.php`, `app/Modules/*/Application/Services/*ImageService.php`.

## Capabilities (cross-module mediator)

The repository uses a “capabilities” subsystem to expose data operations through stable string keys (in-process, not HTTP). This reduces direct coupling between modules.

Where it appears:

- Admin screens (example): Projects resolve skills via `skills.list.v1` (`app/Modules/Projects/Http/Controllers/ProjectController.php`, `app/Modules/Skills/Application/Capabilities/Providers/SkillList.php`).
- Supported locales resolution: multiple modules read `website.locales.supported.v1` (`app/Modules/*/Application/Services/SupportedLocalesResolver.php`, `app/Modules/WebsiteSettings/Application/Capabilities/Providers/SupportedLocales.php`).
- CMS section enrichment: Content Management fetches section data from capability keys (`app/Modules/ContentManagement/Application/Capabilities/SectionCapabilitiesDataFetcher.php`).

Core wiring:

- Container + resolver: `app/Modules/Capabilities/Infrastructure/Providers/CapabilitiesServiceProvider.php`, `app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`
- Provider registration helper: `app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`

## Module documentation

- Module index: [`docs/modules/README.md`](../modules/README.md)
- Root project overview: [`README.md`](../../README.md)
