# ADR 0001: Modular Monolith by Domain Modules

## Status

Accepted (evident in current codebase).

## Context

The application contains multiple domain areas (content management, projects, initiatives, skills, images, etc.) that need independent routing, bindings, and presentation composition, while still shipping as a single Laravel application.

## Decision

Organize the backend as a modular monolith:

- Each domain area lives in `app/Modules/<ModuleName>/` and commonly follows a layered structure (`Application/Domain/Http/Infrastructure/Presentation`).
- Each module wires its routes and container bindings through a dedicated service provider under `app/Modules/<ModuleName>/Infrastructure/Providers/*ServiceProvider.php`.
- A central `app/Providers/AppServiceProvider.php` registers all module service providers.

## Consequences

- Clear boundaries: modules encapsulate their routes/controllers/services and infrastructure bindings.
- Composition remains centralized through Laravel's service provider mechanism.
- Cross-cutting concerns can be shared via `app/Modules/Shared/*` and shared middleware configuration in `bootstrap/app.php`.
- Cross-module data access can be mediated through the Capabilities subsystem (providers registered by module, resolved by key) instead of direct module-to-module service dependencies:
  - Subsystem: `app/Modules/Capabilities/*`
  - Contracts/registration helpers: `app/Modules/Shared/Contracts/Capabilities/*`, `app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`

## Evidence

- Module tree: `app/Modules/`
- Composition root: `app/Providers/AppServiceProvider.php`
- Module providers: `app/Modules/*/Infrastructure/Providers/*ServiceProvider.php`
