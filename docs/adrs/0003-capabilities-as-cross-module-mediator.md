# ADR 0003: Capabilities as a Cross-Module Mediator

## Status

Accepted (evident in current codebase).

## Context

Multiple domain modules need to share read-oriented data to support admin UX and public page rendering (for example: listing skills for project forms, resolving website-supported locales for translation flows, and fetching section payloads for content-managed templates).

Direct module-to-module service calls would create hard dependencies between modules and increase coupling (for example, Projects depending on Skills internals, or multiple modules depending directly on WebsiteSettings service APIs).

## Decision

Use the Capabilities subsystem as a mediator for cross-module data access:

- Provider modules expose operations as capability providers implementing `ICapabilityProvider`.
- Each capability is identified by a stable string key (for example `skills.list.v1`).
- Consumer modules request data by key through a gateway/resolver (`ICapabilityDataResolver`), rather than depending on provider module internal services or repositories.

Capabilities are executed in-process (not HTTP). They are registered in the Laravel container and invoked directly through the shared resolver.

## Consequences

- Reduced coupling: consumers depend on shared contracts + capability keys, not provider module internals.
- Clear integration surface: a capability key + schema becomes a lightweight cross-module API.
- Centralized validation/execution behavior:
  - Parameter validation/normalization is enforced by the capabilities domain (`CapabilityParameterValidator`).
  - Error handling for missing capabilities and execution failures is centralized (`CapabilityResolver`).
- Tradeoffs:
  - Capability keys become part of the "public" integration surface and must be treated as stable identifiers.
  - Discoverability requires documentation (catalog is in code, but not inherently visible to consumers unless documented).
  - Since calls are in-process, capabilities share runtime and failure modes with the main request.

## Evidence

Subsystem and contracts:

- Container bindings for factory/catalog/resolver:
  - `app/Modules/Capabilities/Infrastructure/Providers/CapabilitiesServiceProvider.php`
- Registry/catalog/resolver implementation:
  - `app/Modules/Capabilities/Domain/Services/CapabilityRegistry.php`
  - `app/Modules/Capabilities/Application/Services/CapabilityCatalogService.php`
  - `app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`
- Shared contracts + provider interface:
  - `app/Modules/Shared/Contracts/Capabilities/ICapabilityProvider.php`
  - `app/Modules/Shared/Contracts/Capabilities/ICapabilityDataResolver.php`
- Provider registration helper used by modules:
  - `app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`

Concrete cross-module usage examples:

- Projects consumes Skills via capability key:
  - Consumer: `app/Modules/Projects/Http/Controllers/ProjectController.php` uses `skills.list.v1`
  - Provider: `app/Modules/Skills/Application/Capabilities/Providers/SkillList.php` defines `skills.list.v1`
- Multiple modules consume WebsiteSettings-supported locales via capability key:
  - Consumers: `app/Modules/*/Application/Services/SupportedLocalesResolver.php` uses `website.locales.supported.v1`
  - Provider: `app/Modules/WebsiteSettings/Application/Capabilities/Providers/SupportedLocales.php` defines `website.locales.supported.v1`
- ContentManagement fetches section payloads via template-declared capability keys:
  - Consumer/fetcher: `app/Modules/ContentManagement/Application/Capabilities/SectionCapabilitiesDataFetcher.php`
  - Gateway: `app/Modules/ContentManagement/Application/Capabilities/CapabilitiesGateway.php`

