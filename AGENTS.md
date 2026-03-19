# AGENTS.md

## Scope
- This directory is the project root for the Laravel application and its local Docker environment.
- The application source of truth lives at this root.
- The Git repository is at this root.

## Project Map
- `docker-compose.yml`: default local Docker runtime for the `wsl-first` workflow.
- `docker-compose.devcontainer.yml`: Dev Container override that adds `workspace` and restores Docker-managed `node_modules`.
- `docs/development/workspace-modes.md`: operational guide for `wsl-first`, `devcontainer-first`, and `host-native`.
- `.env.docker`: Docker Compose and local container settings for this workspace.
- `.env`: Laravel application environment.
- `docker/laravel/Dockerfile`: PHP-FPM development image with Composer, Node, npm, and Laravel-ready extensions.
- `docker/devcontainer/Dockerfile`: editor-facing Dev Container image for the `workspace` service.
- `docker/nginx/default.conf.template`: Nginx template with Laravel public root and Vite proxy rules.
- MySQL data is stored in the Docker named volume `db_data`, not in a source-controlled project directory.

## Working Assumptions
- Prefer making application changes from this root.
- Prefer running framework, Composer, npm, and test commands from this root.
- Prefer using the default `wsl-first` Docker workflow unless the task explicitly targets the Dev Container or host-native mode.
- Treat database storage as Docker runtime state, not as editable project files.

## Read Before Editing
- Start with `README.md` for project-wide context.
- Read only the docs relevant to the task, usually from:
  - `docs/backend/README.md`
  - `docs/frontend/README.md`
  - `docs/development/workspace-modes.md` for environment/runtime changes
  - `docs/modules/*`
- For module-specific work, inspect the matching module documentation before changing code.

## Application Architecture
- Backend: Laravel 12 modular monolith under `app/Modules/*`.
- Frontend: Inertia + React + TypeScript under `resources/js`.
- UI templates and CMS sections live under `resources/templates`.
- Shared docs are part of the maintenance surface; update docs when behavior or architecture changes materially.

## Preferred Command Context
- Workspace-level Docker commands run from this root.
- If your local shell exports `COMPOSE_ENV_FILES=.env.docker`, `docker compose ...`
  will automatically use `.env.docker` without needing an explicit `--env-file`.
- If the containers are expected to be the runtime, prefer the mode-specific command flow:
  - `wsl-first` default: `docker compose up -d`
  - fallback explicit form: `docker compose --env-file .env.docker up -d`
  - `devcontainer-first`: open VS Code via `.devcontainer/devcontainer.json`
  - `docker compose --env-file .env.docker logs -f init-backend`
  - `docker compose --env-file .env.docker logs -f php`
  - `docker compose --env-file .env.docker exec php php artisan ...`
  - `docker compose --env-file .env.docker exec php composer ...`
  - `docker compose --env-file .env.docker exec php npm ...`
- The project also supports native `composer` / `npm` workflows when Docker is not required.

## Common Commands
- Start default Docker stack: `docker compose up -d`
- Start default Docker stack without shell export: `docker compose --env-file .env.docker up -d`
- Start Dev Container workflow: `Dev Containers: Reopen in Container`
- Stop stack: `docker compose --env-file .env.docker down`
- Stop Dev Container stack explicitly: `docker compose -f docker-compose.yml -f docker-compose.devcontainer.yml down -v`
- Rebuild PHP image: `docker compose --env-file .env.docker build php`
- Re-run backend bootstrap manually: `docker compose --env-file .env.docker run --rm init-backend`
- Laravel Artisan in container: `docker compose --env-file .env.docker exec php php artisan <command>`
- Composer in container: `docker compose --env-file .env.docker exec php composer <command>`
- npm in container: `docker compose --env-file .env.docker exec php npm <command>`
- Test suite in container: `docker compose --env-file .env.docker exec php php artisan test`
- Frontend lint in container: `docker compose --env-file .env.docker exec php npm run lint`

## Source Conventions
- Search with `rg` / `rg --files`.
- Prefer minimal, targeted changes that match existing patterns.
- Follow existing module boundaries instead of introducing cross-module shortcuts.
- Keep naming and file placement consistent with the current backend module and frontend registry structure.
- Respect the existing TypeScript strictness and current ESLint / Prettier setup.
- Respect Laravel conventions already present in the codebase rather than introducing parallel abstractions.

## Frontend Conventions
- Page entrypoints live under `resources/js/app/pages`.
- Shared utilities live under `resources/js/common`.
- Reusable UI primitives live under `resources/js/components`.
- Domain-specific frontend code lives under `resources/js/modules`.
- Preserve the existing Inertia page registry pattern and locale-loading conventions.
- Reuse existing Tailwind and component patterns before introducing new primitives.

## Backend Conventions
- Prefer adding behavior inside the relevant module under `app/Modules/<ModuleName>`.
- Keep layers coherent: `Application`, `Domain`, `Http`, `Infrastructure`, `Presentation`.
- Reuse the capabilities system when cross-module data access is already modeled that way.
- Check routes in `routes/web.php` and `app/Modules/*/Routes/*.php` before adding endpoints.

## Data and Environment Safety
- Be careful with `.env.docker` and `.env`; they serve different purposes.
- Remember that `wsl-first` uses bind-mounted `./node_modules`, while `devcontainer-first` uses a Docker named volume for `node_modules`.
- When switching between Docker workflows, clean the previous mode's dependency state before assuming the next one is healthy.
- Treat generated or cache directories as non-source unless the task specifically targets them:
  - `vendor`
  - `node_modules`
  - `public/build`
  - `bootstrap/cache`
  - `storage`
  - `.cache`
  - `.composer`
  - `.npm`

## Verification
- For backend changes, prefer `php artisan test`.
- For frontend changes, prefer `npm run lint`.
- If a task affects build behavior, also consider `npm run build`.
- If a task affects Docker/runtime wiring, verify with `docker compose config` or the relevant container command.
- Report clearly when verification could not be run.

## Git Notes
- Run Git commands from this root.
- Do not revert unrelated user changes.
- Pay attention to untracked work already present in the repository before editing nearby files.

## When Updating Docs
- Update `README.md` or the relevant files under `docs/` when changing:
  - architecture
  - module responsibilities
  - developer workflow
  - environment/runtime behavior
  - public or admin behavior with non-obvious contracts

## Avoid
- Editing generated assets or dependency folders unless required.
- Treating Docker-managed database storage as application code.
- Moving code across modules without a strong reason.
- Introducing new architectural patterns without first checking whether the existing docs and module structure already define one.
