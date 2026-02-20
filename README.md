# Portfolio Studio (Laravel 12 + Inertia + React)

A modular Laravel + Inertia studio for a content-managed public site and an admin dashboard.

- Backend: Laravel modular monolith under `app/Modules/*` (`app/Providers/AppServiceProvider.php`)
- Frontend: React/TypeScript via Inertia + Vite (`resources/js/app.tsx`, `vite.config.js`)
- Documentation-first structure: cross-cutting overviews + dedicated module docs (`docs/`)

## What’s included (high level)

This repository contains:

- Public site rendered via Inertia (`resources/views/app.blade.php`, `config/inertia.php`)
- Admin area (dashboard + module screens) rendered via Inertia pages (`routes/web.php`, `resources/js/app/pages/*`)
- Content-managed pages composed from “section templates” and module-provided section components (`resources/templates/**`, `resources/js/modules/*/sectionRegistryProvider.ts`)
- Localization split into public vs system locale cookies (`routes/web.php`, `config/localization.php`)
- A cross-module “capabilities” subsystem for in-process data access via stable keys (`app/Modules/Capabilities/**`, [`docs/adrs/0003-capabilities-as-cross-module-mediator.md`](docs/adrs/0003-capabilities-as-cross-module-mediator.md))

Portfolio data modules documented under [`docs/modules/`](docs/modules/) include: Skills, Experiences, Courses, Contact Channels, Projects, Initiatives, Images, Content Management, Mail (contact messages), System Locale, Identity & Access, Shared, and Inertia (see [`docs/modules/README.md`](docs/modules/README.md)).

## Feature highlights (evidence-based)

- Admin CRUD for portfolio entities such as skills, experiences, courses, projects, and initiatives (module routes + UI under `app/Modules/*` and `resources/js/app/pages/*`; module docs in [`docs/modules/`](docs/modules/))
- Multi-locale content model with per-entity translations and an optional “locale swap” flow when changing a base record’s locale (`app/Modules/*/Application/Services/*LocaleSwapService.php`, `app/Modules/*/Http/Mappers/*InputMapper.php`, [`docs/backend/README.md`](docs/backend/README.md))
- Image uploads and attachments implemented as a shared morph pivot (`image_attachments`) reused across modules (`database/migrations/2025_12_16_191418_create_image_attachments_table.php`, `app/Modules/Images/**`)
- Contact form submission endpoint with optional host notification email when `MAIL_TO_ADDRESS` is configured (`routes/web.php`, `app/Modules/Mail/Application/Services/MessageService.php`, `.env.example`)
- CMS-style public pages composed from section templates and capability-enriched section payloads (`resources/templates/**`, `app/Modules/ContentManagement/**`, `resources/js/modules/content-management/**`)

## Tech stack

**Backend**
- PHP 8.2+ (`composer.json`)
- Laravel 12 (`composer.json`, `bootstrap/app.php`)
- Inertia Laravel adapter (`composer.json`)
- Ziggy route helper shared to the client (`composer.json`, `resources/views/app.blade.php`)

**Frontend**
- React + TypeScript (`package.json`, `tsconfig.json`)
- Inertia React adapter (`package.json`, `resources/js/app/inertia/InertiaApp.tsx`)
- Vite (`vite.config.js`)
- Tailwind CSS (`resources/css/app.css`, `tailwind.config.ts`)

**Tooling**
- PHPUnit via `php artisan test` (`composer.json`, `phpunit.xml`)
- ESLint + Prettier (`package.json`, `eslint.config.js`, `.prettierrc`)
- Laravel Pint (`composer.json`, `vendor/bin/pint`)

## Architecture at a glance

**Backend**
- Modular monolith: modules in `app/Modules/*` and registered in `app/Providers/AppServiceProvider.php`
- Route composition: core routes in `routes/web.php`, module routes in `app/Modules/*/Routes/*.php`
- Inertia shared props and request-aware behavior via `App\Modules\Inertia\Http\Middleware\HandleInertiaRequests` (`bootstrap/app.php`, `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`)

**Frontend**
- App bootstraps from `resources/js/app.tsx` and sets up Inertia in `resources/js/app/inertia/InertiaApp.tsx`
- Inertia pages are registered through a page registry provider (`resources/js/app/pages/pageRegistryProvider.ts`)
- Client-side navigation uses Ziggy’s `route(...)` helper (shared via `resources/views/app.blade.php`, `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`)

See the detailed overviews:
- Backend overview: [`docs/backend/README.md`](docs/backend/README.md)
- Frontend overview: [`docs/frontend/README.md`](docs/frontend/README.md)

## Quickstart (local development)

### Prerequisites

- PHP 8.2+ and Composer (`composer.json`)
- Node.js + npm (for Vite + TypeScript) (`package.json`)
- A configured database (defaults to MySQL) (`.env.example`, `config/database.php`)

### Setup

Installs dependencies, creates `.env` from `.env.example` if missing, generates an app key, runs migrations, installs JS deps, and builds assets (`composer.json`):
```sh
composer setup
```

### Run dev stack

Runs the PHP server, queue listener, Laravel Pail log tailing, and Vite in parallel (`composer.json`):
```sh
composer dev
```

### Tests and linting

```sh
composer test
npm run lint
./vendor/bin/pint
```

## Key runtime notes (evidence-based)

- Database: configured via `DB_CONNECTION` (default is `mysql`) (`.env.example`, `config/database.php`)
- Queue: configured via `QUEUE_CONNECTION` (default is `database`) and started as part of `composer dev` (`.env.example`, `config/queue.php`, `composer.json`)
- Vite dev server defaults: `VITE_HOST=localhost`, `VITE_PORT=5173` (`.env.example`, `vite.config.js`)
- Contact form notifications: only sent when `MAIL_TO_ADDRESS` is configured; default local mailer is `log` (`.env.example`, `config/mail.php`, `app/Modules/Mail/Application/Services/MessageService.php`)
- Locale endpoints: public locale via `POST /set-locale`, system locale via `POST /system/locale` (`routes/web.php`, `config/localization.php`)

## Security / scope notes

- Some auth endpoints (registration and password reset) are intentionally disabled (commented out routes) in `app/Modules/IdentityAccess/Routes/auth.php`.

## Deployment (shared hosting / Apache)

Laravel expects the web server document root to point to `public/`. On shared hosting providers, the document root is often fixed to something like `public_html/`.

If you cannot change the document root to `public/`, this repository includes a root `.htaccess` that forwards requests to `public/` while keeping clean URLs:

- Root rewrite file: [`.htaccess`](.htaccess)
- Laravel front controller rules inside `public/`: [`public/.htaccess`](public/.htaccess)

If you use the included GitHub Actions deployment workflows, the frontend build is published to `frontend-dist` and deployed from that branch (see [CI/CD (GitHub Actions)](#cicd-github-actions)).

## CI/CD (GitHub Actions)

This repository includes GitHub Actions workflows under [`.github/workflows/`](.github/workflows/):

- Backend deploy pipeline on `master` pushes (backend-related paths only): [`.github/workflows/backend-deploy.yml`](.github/workflows/backend-deploy.yml)
  - Connects to a remote host over SSH, hard-resets the working tree to `origin/master`, runs Composer (install when `composer.*` changed, otherwise `dump-autoload -o`), runs `php artisan migrate --force` if migrations changed, then runs `php artisan optimize`.
  - Assumes the target directory on the server is a git clone of this repo (has `.git` and an `origin` remote).
  - Requires secrets: `SSH_PRIVATE_KEY`, `KNOWN_HOSTS`, `HOST`, `PORT`, `USERNAME`, `TARGET_DIR` (and optional `APP_DIR` to force the app path).
- Backend optimize (manual utility): [`.github/workflows/backend-optimize.yml`](.github/workflows/backend-optimize.yml)
  - Runs `composer dump-autoload -o`, `php artisan optimize:clear`, and `php artisan optimize` on a remote host over SSH.
- Frontend build publish on `master` pushes (frontend-related paths only): [`.github/workflows/frontend-build.yml`](.github/workflows/frontend-build.yml)
  - Runs `npm ci` + `npm run build` and force-pushes `public/build` into a `frontend-dist` branch.
- Frontend deploy from `frontend-dist`: [`.github/workflows/frontend-deploy.yml`](.github/workflows/frontend-deploy.yml)
  - Uses `rsync` over SSH to upload `public/build` to the server.
  - Requires secrets: `SSH_PRIVATE_KEY`, `KNOWN_HOSTS`, `HOST`, `PORT`, `USERNAME`, `TARGET_DIR`.

## Documentation map

- Backend overview (cross-cutting): [`docs/backend/README.md`](docs/backend/README.md)
- Frontend overview (cross-cutting): [`docs/frontend/README.md`](docs/frontend/README.md)
- Module docs index: [`docs/modules/README.md`](docs/modules/README.md)
- Architecture decisions (ADRs): [`docs/adrs/`](docs/adrs/)

## Copyright / License

Copyright (c) 2026 Felipe Ruiz Terrazas. All rights reserved.

This repository is **not** open source. No license is granted to use, copy, modify, or distribute this code unless you have an explicit written agreement with the copyright holder.

Third-party dependencies are licensed by their respective authors under their own terms (see `composer.lock` / `package-lock.json`).
