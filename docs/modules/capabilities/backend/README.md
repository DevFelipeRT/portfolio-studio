# Capabilities (Backend)

Scope: an in-process “cross-module API” used by modules to expose read-oriented operations behind stable string keys (e.g. `projects.visible.v1`) and consume them without hard dependencies on internal services/repositories.

Evidence:

- Service provider + container wiring: `app/Modules/Capabilities/Infrastructure/Providers/CapabilitiesServiceProvider.php`
- Core services: `app/Modules/Capabilities/Application/Services/CapabilitiesFactory.php`, `app/Modules/Capabilities/Application/Services/CapabilityCatalogService.php`, `app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`, `app/Modules/Capabilities/Domain/Services/CapabilityParameterValidator.php`
- Registry + models: `app/Modules/Capabilities/Domain/Services/CapabilityRegistry.php`, `app/Modules/Capabilities/Domain/Models/RegisteredCapability.php`
- Config: `app/Modules/Capabilities/Config/capabilities.php`
- Contracts: `app/Modules/Shared/Contracts/Capabilities/*`
- Provider registration helper: `app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`
- Example providers: `app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`, `app/Modules/Skills/Application/Capabilities/Providers/SkillList.php`, `app/Modules/WebsiteSettings/Application/Capabilities/Providers/SupportedLocales.php`
- Example consumer gateway: `app/Modules/ContentManagement/Application/Capabilities/CapabilitiesGateway.php`

## What a capability is

A capability is:

- identified by a stable string key (versioned in the key name), and
- implemented by a provider class that can be registered into a catalog at boot time (`app/Modules/Shared/Contracts/Capabilities/ICapabilityProvider.php`, `app/Modules/Shared/Contracts/Capabilities/ICapabilityCatalog.php`).

Capabilities are executed **in-process** (not HTTP). Consumers call a resolver in the same Laravel runtime (`app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`).

## Container wiring

`CapabilitiesServiceProvider` binds:

- `ICapabilitiesFactory` → `CapabilitiesFactory` (creates keys and definitions)
- `ICapabilityCatalog` → `CapabilityCatalogService` (registers and looks up providers/definitions)
- `ICapabilityDataResolver` → `CapabilityResolver` (validates + executes) (`app/Modules/Capabilities/Infrastructure/Providers/CapabilitiesServiceProvider.php`).

The catalog uses `CapabilityRegistry` as its in-memory store (`app/Modules/Capabilities/Application/Services/CapabilityCatalogService.php`, `app/Modules/Capabilities/Domain/Services/CapabilityRegistry.php`).

## Parameter validation and normalization

Before executing a provider, `CapabilityResolver` calls `CapabilityParameterValidator::validateAndNormalize(...)` using the capability’s parameter schema (`app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`, `app/Modules/Capabilities/Domain/Services/CapabilityParameterValidator.php`).

Behavior is configured by `config('capabilities.validation')` (`app/Modules/Capabilities/Config/capabilities.php`):

- `strict_types`: when true, primitive types are enforced for non-null values
- `allow_unknown_parameters`: when true, extra parameters not declared in the schema are passed through

## Provider registration (by modules)

Modules register their own capability providers during `register()` using `RegisterCapabilitiesTrait` (`app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`).

Example: `SkillsServiceProvider` registers `SkillList` and `SkillsByCategory` (`app/Modules/Skills/Infrastructure/Providers/SkillsServiceProvider.php`).

## How to define a provider

Implement `ICapabilityProvider`:

- `getDefinition()` returns an `ICapabilityDefinition` (typically created via `ICapabilitiesFactory::createPublicDefinition(...)`)
- `execute(array $parameters, ?ICapabilityContext $context = null)` returns the result (`app/Modules/Shared/Contracts/Capabilities/ICapabilityProvider.php`, `app/Modules/Capabilities/Application/Services/CapabilitiesFactory.php`).

Example key and schema (`VisibleProjects`):

- Key: `projects.visible.v1`
- Parameters: optional `locale` (string), optional `limit` (int) (`app/Modules/Projects/Application/Capabilities/Providers/VisibleProjects.php`)

## How consumers call capabilities

Consumers typically depend on shared contracts and use a gateway that:

- adapts a string key to an `ICapabilityKey` via `ICapabilitiesFactory`, and
- delegates to `ICapabilityDataResolver` (`app/Modules/ContentManagement/Application/Capabilities/CapabilitiesGateway.php`).

This is used directly by ContentManagement to resolve template-declared dynamic data sources (`app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`).

## Error behavior

`CapabilityResolver` throws:

- not found: `CapabilityNotFoundException`
- validation errors: `CapabilityValidationException`
- execution wrapper: `CapabilityExecutionException` (wraps provider exceptions) (`app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`, `app/Modules/Capabilities/Domain/Exceptions/*`).

