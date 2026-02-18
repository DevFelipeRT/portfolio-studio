# Portfolio (Laravel + Inertia + React)

Portfolio website with an authenticated admin panel for managing content and portfolio entities (projects, experiences, courses, skills, initiatives, images, contact channels) and a public-facing site rendered via Inertia.

## Tech Stack

**Backend**
- PHP (`composer.json`)
- Laravel (`composer.json`)
- Inertia Laravel adapter (`composer.json`)

**Frontend**
- React + TypeScript (`package.json`, `tsconfig.json`)
- Inertia React adapter (`package.json`)
- Vite + Tailwind CSS (`vite.config.js`, `tailwind.config.ts`)

## Architecture (High Level)

**Backend**
- Modular monolith organized under `app/Modules/*` and wired via `app/Providers/AppServiceProvider.php`.
- Routes are composed from `routes/web.php` and module route files under `app/Modules/*/Routes/*.php`.
- Admin routes are typically protected with `auth` + `verified` middleware (see module service providers under `app/Modules/*/Infrastructure/Providers/*ServiceProvider.php`).

**Frontend**
- Inertia app bootstraps from `resources/js/app.tsx`.
- Pages are registered via a page registry (`resources/js/app/pages/pageRegistryProvider.ts`) and resolved by name during Inertia navigation.
- CSR is used by default with initial page JSON embedded in `resources/views/app.blade.php` (see `config/inertia.php`).

## Quickstart

Install dependencies, configure env, run migrations, and build assets:
```sh
composer setup
```

Start the local dev stack (PHP server, queue worker, log tailing, Vite):
```sh
composer dev
```

Run tests (currently focused on auth/profile basics):
```sh
composer test
```

Frontend-only commands:
```sh
npm run dev
npm run build
npm run lint
```

## Key Runtime Notes

 - Database connection is configured by `DB_CONNECTION` (`config/database.php`). The application default is MySQL when `DB_CONNECTION` is unset.
- Queue defaults to the database driver and is started in `composer dev` (`.env.example`, `config/queue.php`, `composer.json`).
- Contact message email notifications are only sent when `MAIL_TO_ADDRESS` is configured (`config/mail.php`, `app/Modules/Mail/Application/Services/MessageService.php`).
- Public locale is set via `POST /set-locale`, system locale via `POST /system/locale` (auth) (`routes/web.php`, `config/localization.php`).

## Documentation

- Backend: `docs/backend/README.md`
- Frontend: `docs/frontend/README.md`
- ADRs: `docs/adrs/`
