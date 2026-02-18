# Backend Documentation

This document describes the backend architecture, HTTP surface, and runtime infrastructure based on the current repository code.

## Entry Points

- HTTP entry: `public/index.php`
- Application configuration (routing, middleware): `bootstrap/app.php`
- Module composition root: `app/Providers/AppServiceProvider.php`

## Architecture Overview

The backend is organized as a modular monolith. Domain-oriented modules live under `app/Modules/*`, typically following a layered structure:

- `Application/`: application services, DTOs, use cases
- `Domain/`: domain models, repository interfaces
- `Http/`: controllers, requests, middleware
- `Infrastructure/`: service providers, repository implementations
- `Presentation/`: mappers/presenters (Inertia view models)

Module service providers are registered centrally in `app/Providers/AppServiceProvider.php`.

## Routing

The main web routes file defines a small set of core endpoints and then module providers load additional route files.

### Core Web Routes

Defined in `routes/web.php`:

- `POST /set-locale` public locale persistence (cookie) via `App\Modules\WebsiteSettings\Http\Controllers\PublicLocaleController@set`
- `POST /system/locale` system locale persistence (cookie), authenticated (`auth`)
- `POST /contact/messages` public contact form submission
- `GET /dashboard` admin dashboard, protected by `auth` + `verified`, renders Inertia page `dashboard/admin/Dashboard`

Health endpoint is configured as `GET /up` in `bootstrap/app.php`.

### Module Routes

Modules load route files under `app/Modules/*/Routes/*.php`. Route registration is done inside module service providers, typically under the `web` middleware group, and admin routes are commonly protected by `auth` + `verified`:

- Content management:
  - Public: `app/Modules/ContentManagement/Routes/public.php` (`GET /`, `GET /content/{slug}`)
  - Admin: `app/Modules/ContentManagement/Routes/admin.php` (pages + sections management under `admin/content/*`)
- Portfolio entities (admin):
  - Projects: `app/Modules/Projects/Routes/admin.php`
  - Initiatives: `app/Modules/Initiatives/Routes/admin.php`
  - Experiences: `app/Modules/Experiences/Routes/admin.php`
  - Courses: `app/Modules/Courses/Routes/admin.php`
  - Skills + skill categories: `app/Modules/Skills/Routes/admin.php`
  - Contact channels (admin + public index): `app/Modules/ContactChannels/Routes/admin.php`, `app/Modules/ContactChannels/Routes/public.php`
  - Images: `app/Modules/Images/Routes/admin.php`
  - Messages (admin inbox): `app/Modules/Mail/Routes/admin.php`
- Website settings + SEO:
  - Public: `app/Modules/WebsiteSettings/Routes/public.php` (`GET /robots.txt`, `GET /sitemap.xml`)
  - Admin: `app/Modules/WebsiteSettings/Routes/admin.php`
- Identity & access:
  - Auth routes: `app/Modules/IdentityAccess/Routes/auth.php`
  - Profile routes: `app/Modules/IdentityAccess/Routes/profile.php`

## Inertia Integration

Inertia middleware is appended to the web middleware stack in `bootstrap/app.php`:

- `App\Modules\Inertia\Http\Middleware\HandleInertiaRequests`

That middleware shares common props (auth user, Ziggy route config, website settings, localization metadata) and also applies a different locale resolution strategy for public content routes (`home` and `content.*` route names):

- `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

## Localization

Two locale concepts exist:

- **Public locale** (site visitor): persisted via `POST /set-locale` and stored in a cookie named by `config('localization.public_cookie_name')` (`config/localization.php`, `app/Modules/WebsiteSettings/Http/Controllers/PublicLocaleController.php`)
- **System locale** (authenticated/admin UX): persisted via `POST /system/locale` and stored in a secure cookie named by `config('localization.system_cookie_name')` (`config/localization.php`, `app/Modules/SystemLocale/Http/Controllers/SystemLocaleController.php`)

Supported system locales are configured in `config/localization.php`.

## Runtime Infrastructure

### Environment Variables

The application reads configuration from environment variables via `env(...)` calls in `config/*.php` and module config files.

- The curated baseline for local setup lives in `.env.example` (used by `composer setup` in `composer.json`).
- Vite dev-server variables are used by the frontend build config (`VITE_HOST`, `VITE_PORT`, `VITE_BIND`) in `vite.config.js`.
- Locale cookie overrides are supported via `APP_SYSTEM_LOCALE_COOKIE` and `APP_PUBLIC_LOCALE_COOKIE` (`config/localization.php`).
- Contact email notifications require `MAIL_TO_ADDRESS` to be set (`config/mail.php`, `app/Modules/Mail/Application/Services/MessageService.php`).
- Inertia SSR can be toggled via `INERTIA_SSR_ENABLED` and related keys (`config/inertia.php`).

### Database

- Database connection is configured by `DB_CONNECTION` (`config/database.php`). The application default is MySQL when `DB_CONNECTION` is unset.
- `.env.example` defaults to MySQL with `DB_HOST` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` set.
- Migrations live under `database/migrations/` and define tables for portfolio/CMS-related entities (projects, initiatives, experiences, courses, pages/sections, images, messages, website settings, translations).

### Cache, Session, Queue

Defaults from `.env.example`:

- Cache store: database (`config/cache.php`)
- Session driver: database (`config/session.php`, `.env.example`)
- Queue driver: database (`config/queue.php`)

The dev script starts a queue listener (`php artisan queue:listen --tries=1`) as part of `composer dev` (`composer.json`).

### Filesystem / Storage

- Private local disk root: `storage/app/private`
- Public disk root: `storage/app/public` with `public/storage` symlink (`config/filesystems.php`)

### Email (Contact Form)

Public contact messages are stored and then emailed to the site owner when host notifications are enabled:

- Submission endpoint: `POST /contact/messages` (`routes/web.php`, `app/Modules/Mail/Http/Controllers/MessageController.php`)
- Persistence + notification: `app/Modules/Mail/Application/Services/MessageService.php`
- Notification mailable: `app/Modules/Mail/Domain/ValueObjects/ContactMessageReceived.php`

Host notifications are disabled when `MAIL_TO_ADDRESS` is empty; in that case the notification is skipped (`config/mail.php`, `MessageService::sendHostNotification`).

### Scheduler

An image cleanup command is scheduled daily at 00:00 UTC:

- Schedule: `routes/console.php`
- Command: `app/Console/Commands/PruneOrphanImages.php`

## Module Catalog (Current)

The following modules are registered in `app/Providers/AppServiceProvider.php`:

- `Capabilities`
- `ContentManagement`
- `ContactChannels`
- `Courses`
- `Experiences`
- `IdentityAccess`
- `Images`
- `Initiatives`
- `Mail`
- `Projects`
- `Skills`
- `WebsiteSettings`

## Capabilities (Cross-Module Mediator)

The repository implements a cross-module "capabilities" subsystem that allows modules to expose data-providing operations through stable string keys, and for other modules to consume those operations without taking a hard dependency on internal services/repositories of the provider module.

This pattern is used in multiple places to reduce direct module-to-module coupling:

- Projects admin screens resolve skills via a capability key instead of calling Skills module internals:
  - Consumer: `app/Modules/Projects/Http/Controllers/ProjectController.php` calls `resolve('skills.list.v1')`
  - Provider: `app/Modules/Skills/Application/Capabilities/Providers/SkillList.php` defines `skills.list.v1`
- Several modules resolve website-supported locales via a capability key instead of depending directly on WebsiteSettings services:
  - Consumers: `app/Modules/*/Application/Services/SupportedLocalesResolver.php` use `website.locales.supported.v1`
  - Provider: `app/Modules/WebsiteSettings/Application/Capabilities/Providers/SupportedLocales.php` defines `website.locales.supported.v1`
- Content-managed templates can declare capability keys, and the ContentManagement module translates section data into capability calls:
  - Consumer: `app/Modules/ContentManagement/Application/Capabilities/SectionCapabilitiesDataFetcher.php`
  - Gateway: `app/Modules/ContentManagement/Application/Capabilities/CapabilitiesGateway.php`

### Logical Flow (End-to-End)

1. **Capabilities subsystem is registered in the container**
   - `app/Modules/Capabilities/Infrastructure/Providers/CapabilitiesServiceProvider.php` binds:
     - `ICapabilitiesFactory` (creates keys/definitions)
     - `ICapabilityCatalog` (registers definitions/providers)
     - `ICapabilityDataResolver` (executes requests by key)
2. **Provider modules register capability providers**
   - Module service providers call `registerCapabilitiesIfAvailable([...])` via `app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`.
   - Example registrations:
     - Skills: `app/Modules/Skills/Infrastructure/Providers/SkillsServiceProvider.php`
     - Projects: `app/Modules/Projects/Infrastructure/Providers/ProjectsServiceProvider.php`
     - WebsiteSettings: `app/Modules/WebsiteSettings/Infrastructure/Providers/WebsiteSettingsServiceProvider.php`
3. **The capability catalog stores providers by key**
   - `app/Modules/Capabilities/Application/Services/CapabilityCatalogService.php` wraps provider + definition into `RegisteredCapability` and stores it in `CapabilityRegistry` (`app/Modules/Capabilities/Domain/Services/CapabilityRegistry.php`).
4. **Consumer modules resolve by key through a gateway**
   - Gateways adapt string keys to `ICapabilityKey` and delegate execution to the shared resolver:
     - `app/Modules/ContentManagement/Application/Capabilities/CapabilitiesGateway.php`
     - `app/Modules/Projects/Application/Capabilities/CapabilitiesGateway.php`
5. **Resolver validates parameters and executes provider**
   - `app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`:
     - looks up the provider via the catalog,
     - validates/normalizes parameters via `CapabilityParameterValidator`,
     - calls `ICapabilityProvider::execute(...)`.
   - Validation behavior is configured in `app/Modules/Capabilities/Config/capabilities.php`.

### Notes

- Capabilities are **in-process** calls (not HTTP); they are resolved via the Laravel container and executed directly by provider classes.
- Most capability definitions in the codebase are created via `ICapabilitiesFactory::createPublicDefinition(...)` (for example `projects.visible.v1` in `app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`).
