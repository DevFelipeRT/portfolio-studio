# Portfolio Studio (Laravel 12 + Inertia + React)

A modular Laravel + Inertia studio for a content-managed public site and an admin dashboard.

- Backend: Laravel modular monolith under `app/Modules/*` (`app/Providers/AppServiceProvider.php`)
- Frontend: React/TypeScript via Inertia + Vite (`resources/js/app.tsx`, `vite.config.js`)
- Documentation-first structure: cross-cutting overviews + dedicated module docs (`docs/`)
- AI collaboration entrypoint via `AGENTS.md` for repository-specific agent guidance

## Index

- [Development Modes](#development-modes)
- [Mode Comparison](#mode-comparison)
- [WSL-first (Default Docker Workflow)](#wsl-first-default-docker-workflow)
- [Devcontainer-first](#devcontainer-first)
- [Host-native](#host-native)
- [Switching Modes](#switching-modes)
- [Key runtime notes (evidence-based)](#key-runtime-notes-evidence-based)
- [What’s included (high level)](#whats-included-high-level)
- [Feature highlights (evidence-based)](#feature-highlights-evidence-based)
- [Tech stack](#tech-stack)
- [Architecture at a glance](#architecture-at-a-glance)
- [Security / scope notes](#security--scope-notes)
- [Deployment (shared hosting / Apache)](#deployment-shared-hosting--apache)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
- [Documentation map](#documentation-map)
- [AI Collaboration](#ai-collaboration)
- [Copyright / License](#copyright--license)

## Development Modes

This repository includes a local Docker development stack driven by:

- `docker-compose.yml`
- `docker-compose.devcontainer.yml`
- `.devcontainer/devcontainer.json`
- `.env.docker`
- `docker/laravel/Dockerfile`
- `docker/devcontainer/Dockerfile`
- `docker/nginx/default.conf.template`

The project supports three explicit local workflows:

- `wsl-first`: Docker runtime with the editor running from WSL. This is the default Docker workflow.
- `devcontainer-first`: Docker runtime plus a dedicated VS Code Dev Container workspace service.
- `host-native`: PHP, Composer, Node.js, and the database run directly on the host.

Use `wsl-first` unless you specifically want the editor inside a Dev Container.

The full operational guide lives in [`docs/development/workspace-modes.md`](docs/development/workspace-modes.md).

## Mode Comparison

| Mode | Runtime | Editor location | `node_modules` strategy | Startup command | Best use case |
| --- | --- | --- | --- | --- | --- |
| `wsl-first` | Docker Compose | VS Code / Codex in WSL | bind-mounted `./node_modules` in the project workspace | `docker compose up -d` | default Docker workflow from WSL without a Dev Container |
| `devcontainer-first` | Docker Compose + Dev Container | VS Code attached to `workspace` | Docker named volume shared by `workspace`, `php`, and `vite` | `Dev Containers: Reopen in Container` | editor-inside-container workflow with fully container-scoped tooling |
| `host-native` | Host OS | VS Code / Codex on host or WSL | host-managed `node_modules` | `composer setup` then `composer dev` | no-Docker local development |

## WSL-first (Default Docker Workflow)

This mode keeps Docker as the runtime, but the editor stays in WSL. The base
[`docker-compose.yml`](docker-compose.yml) is now aligned to this workflow.

What it means:

- runtime services still run in Docker: `db`, `php`, `vite`, `nginx`, `init-backend`
- no `workspace` service is involved
- `node_modules` lives in the project workspace as `./node_modules`, then gets bind-mounted into the containers
- the short Docker command flow stays centered on `docker compose up -d`

One-time setup:

```sh
cp .env.docker.example .env.docker
echo 'export COMPOSE_ENV_FILES=.env.docker' >> ~/.bashrc
source ~/.bashrc
```

Daily commands:

```sh
docker compose up -d
docker compose logs -f init-backend
docker compose exec php php artisan test
docker compose exec php composer install
docker compose exec php npm run lint
```

Access URLs:

- Public site: `http://localhost`
- Admin login: `http://localhost/login`

Use the explicit `--env-file .env.docker` form if your shell does not export
`COMPOSE_ENV_FILES=.env.docker`.

## Devcontainer-first

This mode keeps Docker as the runtime and moves the editor into the dedicated
`workspace` service declared in [`docker-compose.devcontainer.yml`](docker-compose.devcontainer.yml).

What it means:

- VS Code attaches to `workspace` through [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json)
- `workspace`, `php`, and `vite` share a Docker-managed named volume for `node_modules`
- the runtime stack is still the same Laravel + Vite + MySQL + Nginx stack
- this is an explicit opt-in workflow layered on top of the base Compose file

First-time setup:

```sh
cp .env.docker.example .env.docker
```

Then:

1. Open the repository root in VS Code.
2. Install the Dev Containers extension if prompted.
3. Run `Dev Containers: Reopen in Container`.
4. Wait for the `workspace`, `db`, `php`, `vite`, and `nginx` services to finish starting.

Day-to-day commands run inside the `workspace` terminal:

```sh
php artisan test
composer install
npm run lint
npm run build
```

Choose this mode when you want the editor, language servers, and CLI tools to
share the same container-scoped dependency tree.

## Host-native

This mode remains supported and is not deprecated by the Docker refactor.

Prerequisites:

- PHP 8.2+ and Composer
- Node.js + npm
- a configured database (MySQL by default)

Setup and run:

```sh
composer setup
composer dev
```

Useful commands:

```sh
php artisan db:seed
composer test
npm run lint
npm run build
./vendor/bin/pint
```

Default local URLs:

- App: `http://127.0.0.1:8000`
- Vite: `http://127.0.0.1:5173`

Default admin credentials after seeding: `admin@example.com` / `password`
(`database/seeders/DatabaseSeeder.php`).

See also: [`docs/backend/seeding.md`](docs/backend/seeding.md).

## Switching Modes

Switching between `wsl-first` and `devcontainer-first` changes where the live
dependency tree lives:

- `wsl-first` uses the project directory `./node_modules`
- `devcontainer-first` uses a Docker named volume for `node_modules`

Do not assume those states are interchangeable. Before switching, stop the
stack and clean the dependency tree that belongs to the previous mode.

Typical reset flow when switching:

```sh
docker compose down
rm -rf node_modules
docker compose -f docker-compose.yml -f docker-compose.devcontainer.yml down -v
```

Then start the target mode again:

- `wsl-first`: `docker compose up -d`
- `devcontainer-first`: `Dev Containers: Reopen in Container`

If you also need a full database reset, use:

```sh
docker compose down -v
docker compose up -d
```

The detailed switching guide, caveats, and copy-pasteable walkthroughs for all
modes are documented in [`docs/development/workspace-modes.md`](docs/development/workspace-modes.md).

## Key runtime notes (evidence-based)

- Database: configured via `DB_CONNECTION` (default is `mysql`) (`.env.example`, `config/database.php`)
- Queue: configured via `QUEUE_CONNECTION` (default is `database`) and started as part of `composer dev` (`.env.example`, `config/queue.php`, `composer.json`)
- Vite dev server defaults: `VITE_PORT=5173` and `VITE_BIND=0.0.0.0` (`.env.example`, `vite.config.js`)
- Docker PHP runtime: the `php` service `security_opt` is configurable via `.env.docker` (`PHP_SECURITY_OPT`, default `seccomp:unconfined`) to support tools that require unprivileged user namespaces (e.g. `bwrap`) (`docker-compose.yml`, `.env.docker.example`)
- Contact form notifications: only sent when `MAIL_TO_ADDRESS` is configured; default local mailer is `log` (`.env.example`, `config/mail.php`, `app/Modules/Mail/Application/Services/MessageService.php`)
- Locale endpoints: public locale via `POST /set-locale`, system locale via `POST /system/locale` (`routes/web.php`, `config/localization.php`)

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
- Inertia React adapter (`package.json`, `resources/js/app/bootstrap/bootApplication.tsx`)
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
- App bootstraps from `resources/js/app.tsx` through `resources/js/app/bootstrap/bootApplication.tsx`
- Inertia pages are registered through a page registry provider (`resources/js/app/pages/pageRegistryProvider.ts`)
- Client-side navigation uses Ziggy’s `route(...)` helper (shared via `resources/views/app.blade.php`, `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`)

See the detailed overviews:
- Backend overview: [`docs/backend/README.md`](docs/backend/README.md)
- Frontend overview: [`docs/frontend/README.md`](docs/frontend/README.md)

## Security / scope notes

- Some auth endpoints (registration and password reset) are intentionally disabled (commented out routes) in `app/Modules/IdentityAccess/Routes/auth.php`.

## Deployment (shared hosting / Apache)

Laravel expects the web server document root to point to `public/`. On shared hosting providers, the document root is often fixed to something like `public_html/`.

### Shared hosting quickstart

Use this path when deploying without Docker and without control over the web server document root.

1. Install backend dependencies:

```sh
composer install --no-dev --optimize-autoloader
```

2. Create the application environment file and configure production values:

```sh
cp .env.example .env
php artisan key:generate
```

3. Configure the production database credentials in `.env`.

4. Run database migrations:

```sh
php artisan migrate --force
```

5. Build frontend assets before deployment:

```sh
npm ci
npm run build
```

6. Optimize the application for production:

```sh
php artisan optimize
```

7. Ensure `storage/` and `bootstrap/cache/` are writable in the target environment.

If you cannot change the document root to `public/`, this repository includes a root `.htaccess` that forwards requests to `public/` while keeping clean URLs:

- Root rewrite file: [`.htaccess`](.htaccess)
- Laravel front controller rules inside `public/`: [`public/.htaccess`](public/.htaccess)

If you use the included GitHub Actions deployment workflows, the frontend build is produced in CI as an artifact and deployed directly to the server over SSH/`rsync` (see [CI/CD (GitHub Actions)](#cicd-github-actions)).

## CI/CD (GitHub Actions)

This repository includes GitHub Actions workflows under [`.github/workflows/`](.github/workflows/):

- Backend deploy pipeline on `master` pushes (backend-related paths only): [`.github/workflows/backend-deploy.yml`](.github/workflows/backend-deploy.yml)
  - Connects to a remote host over SSH, hard-resets the working tree to `origin/master`, runs Composer (install when `composer.*` changed, otherwise `dump-autoload -o`), runs `php artisan migrate --force` if migrations changed, then runs `php artisan optimize`.
  - Assumes the target directory on the server is a git clone of this repo (has `.git` and an `origin` remote).
  - Requires secrets: `SSH_PRIVATE_KEY`, `KNOWN_HOSTS`, `HOST`, `PORT`, `USERNAME`, `TARGET_DIR` (and optional `APP_DIR` to force the app path).
- Backend optimize (manual utility): [`.github/workflows/backend-optimize.yml`](.github/workflows/backend-optimize.yml)
  - Runs `composer dump-autoload -o`, `php artisan optimize:clear`, and `php artisan optimize` on a remote host over SSH.
- Frontend build + deploy on `master` pushes (frontend-related paths only): [`.github/workflows/frontend-build-deploy.yml`](.github/workflows/frontend-build-deploy.yml)
  - Runs `npm ci` + `npm run build`, verifies `public/build`, uploads it as a GitHub Actions artifact, then deploys that artifact to the server with `rsync` over SSH.
  - Deploy target:
    - If `TARGET_DIR` ends with `/public`, uploads into `${TARGET_DIR}/build/`.
    - Otherwise, uploads into `${TARGET_DIR}/public/build/` (Laravel app root).
  - After upload, resolves the Laravel app directory and runs `php artisan optimize:clear` + `php artisan optimize`.
  - Requires secrets: `SSH_PRIVATE_KEY`, `KNOWN_HOSTS`, `HOST`, `PORT`, `USERNAME`, `TARGET_DIR` (and optional `APP_DIR` to force the app path).

## Documentation map

- Backend overview (cross-cutting): [`docs/backend/README.md`](docs/backend/README.md)
- Frontend overview (cross-cutting): [`docs/frontend/README.md`](docs/frontend/README.md)
- Module docs index: [`docs/modules/README.md`](docs/modules/README.md)
- Architecture decisions (ADRs): [`docs/adrs/`](docs/adrs/)

## AI Collaboration

This repository is being documented to support both human contributors and coding agents.

Current agent-oriented entrypoint:

- [`AGENTS.md`](AGENTS.md): project map, command conventions, environment rules, verification guidance, and editing constraints for automated collaborators

Documentation strategy:

- `README.md` remains the primary human-oriented overview
- `AGENTS.md` captures repository-specific operational guidance for agents
- additional AI-focused runbooks and structured guidance may be added later as the collaboration workflow evolves

## Copyright / License

Copyright (c) 2026 Felipe Ruiz Terrazas. All rights reserved.

This repository is **not** open source. No license is granted to use, copy, modify, or distribute this code unless you have an explicit written agreement with the copyright holder.

Third-party dependencies are licensed by their respective authors under their own terms (see `composer.lock` / `package-lock.json`).
