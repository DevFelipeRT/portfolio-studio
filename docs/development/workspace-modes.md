# Workspace Modes

This project supports three local development workflows:

- `wsl-first`
- `devcontainer-first`
- `host-native`

The goal of this guide is to make the runtime, editor location, `node_modules`
strategy, startup command, and switching steps explicit for each mode.

## Comparison

| Mode | Runtime | Editor location | `node_modules` | Startup path | Best fit |
| --- | --- | --- | --- | --- | --- |
| `wsl-first` | Docker Compose | VS Code / Codex in WSL | bind-mounted `./node_modules` | `docker compose up -d` | default Docker workflow from WSL |
| `devcontainer-first` | Docker Compose + Dev Container | VS Code in `workspace` | Docker named volume | `Dev Containers: Reopen in Container` | editor and toolchain fully inside containers |
| `host-native` | Host OS | host or WSL | host-managed `./node_modules` | `composer setup`, `composer dev` | no-Docker local development |

## Shared Docker Prerequisites

Both Docker workflows use:

- `.env.docker`
- [`docker-compose.yml`](../../docker-compose.yml)
- [`docker-compose.devcontainer.yml`](../../docker-compose.devcontainer.yml) for the Dev Container mode only

Create the Docker env file once:

```sh
cp .env.docker.example .env.docker
```

Recommended shell setup for short Docker commands:

```sh
echo 'export COMPOSE_ENV_FILES=.env.docker' >> ~/.bashrc
source ~/.bashrc
```

With that shell export in place, `docker compose up -d` automatically uses
`.env.docker`. Without it, use the longer `docker compose --env-file .env.docker ...`
form.

## WSL-first

`wsl-first` is the default Docker workflow for this repository.

### What it means

- Docker is still the runtime.
- Your editor stays in WSL.
- The base Compose file is enough.
- `node_modules` lives in the project workspace as `./node_modules`.
- No Dev Container is involved.

### One-time setup

1. Ensure Docker Desktop or Docker Engine is available to WSL.
2. Create `.env.docker`:

```sh
cp .env.docker.example .env.docker
```

3. Optional but recommended: export `COMPOSE_ENV_FILES=.env.docker` in your WSL shell.

### Start the environment

```sh
docker compose up -d
```

If you did not export `COMPOSE_ENV_FILES`, run:

```sh
docker compose --env-file .env.docker up -d
```

### Check bootstrap and open the app

```sh
docker compose logs -f init-backend
```

URLs:

- Public site: `http://localhost`
- Admin login: `http://localhost/login`

### Day-to-day commands

```sh
docker compose exec php php artisan test
docker compose exec php composer install
docker compose exec php npm run lint
docker compose exec php npm run build
docker compose exec php php artisan migrate
```

### Reset local state

Reset containers and database volume:

```sh
docker compose down -v
docker compose up -d
```

### `node_modules` caveat

In this mode, `./node_modules` is the live dependency tree. It is intentionally
visible from WSL because the editor is outside the containers and still needs a
workspace-local dependency layout.

## Devcontainer-first

`devcontainer-first` keeps Docker as the runtime, but moves the editor into the
dedicated `workspace` service.

### What it means

- VS Code attaches to `workspace`.
- The Dev Container loads both Compose files.
- `workspace`, `php`, and `vite` share the same Docker-managed named volume for
  `node_modules`.
- This is the container-first editor workflow.

### Prerequisites

- Docker Engine with Docker Compose
- VS Code
- Dev Containers extension

### First-time setup

1. Create `.env.docker` if needed:

```sh
cp .env.docker.example .env.docker
```

2. Open the repository root in VS Code.
3. Run `Dev Containers: Reopen in Container`.
4. Wait for the `workspace`, `db`, `php`, `vite`, and `nginx` services to start.

### Day-to-day workflow

Run commands in the integrated terminal inside `workspace`:

```sh
php artisan test
composer install
npm run lint
npm run build
```

### What the `workspace` service is for

`workspace` is the stable editor-facing container. It exists so VS Code,
language servers, CLI tools, and the dependency tree all agree on the same
container-scoped workspace.

### How it differs from `wsl-first`

- `wsl-first` keeps the editor in WSL and uses bind-mounted `./node_modules`.
- `devcontainer-first` runs the editor in `workspace` and uses a Docker named
  volume for `node_modules`.
- `devcontainer-first` is the better fit when you want the editor environment
  fully standardized inside Docker.

### Neutral note on editor auth friction

If container-attached editor auth, extensions, or remote-session tooling becomes
unreliable in your setup, prefer `wsl-first`. That is why `wsl-first` is the
default Docker workflow for this repository.

## Host-native

`host-native` remains supported and is not deprecated by the Docker refactor.

### Prerequisites

- PHP 8.2+
- Composer
- Node.js + npm
- a configured database

### Setup

```sh
composer setup
```

### Seed demo data

```sh
php artisan db:seed
```

Default admin credentials: `admin@example.com` / `password`.

### Run the app

```sh
composer dev
```

### Useful commands

```sh
composer test
npm run lint
npm run build
./vendor/bin/pint
```

Default URLs:

- App: `http://127.0.0.1:8000`
- Vite: `http://127.0.0.1:5173`

## Switching Between `wsl-first` and `devcontainer-first`

The main reason switching needs care is that the dependency tree is stored in a
different place in each Docker workflow:

- `wsl-first`: `./node_modules`
- `devcontainer-first`: Docker named volume declared by the Dev Container
  override

Those states should not be treated as interchangeable.

### Switch from `wsl-first` to `devcontainer-first`

1. Stop the base stack:

```sh
docker compose down
```

2. Remove the WSL-side dependency tree:

```sh
rm -rf node_modules
```

3. Open VS Code and run `Dev Containers: Reopen in Container`.

The Dev Container startup will recreate the Docker-managed `node_modules`
volume.

### Switch from `devcontainer-first` to `wsl-first`

1. Stop the Dev Container stack with both Compose files:

```sh
docker compose -f docker-compose.yml -f docker-compose.devcontainer.yml down -v
```

2. Remove any stale bind-mounted dependency tree if needed:

```sh
rm -rf node_modules
```

3. Restart the default Docker workflow:

```sh
docker compose up -d
```

### Full cleanup when you are unsure

If the dependency state or local caches look inconsistent, use the more
aggressive reset:

```sh
docker compose down -v
docker compose -f docker-compose.yml -f docker-compose.devcontainer.yml down -v
rm -rf node_modules
docker compose up -d
```

That clears runtime volumes, removes the previous mode's dependency tree, and
rebuilds the default `wsl-first` stack.
