# Exception Conventions

This document defines how backend code in this repository should represent and render exceptions for Laravel 12 + Inertia + React.

The goal is to keep the error surface intentional, predictable, and aligned with the transport that is actually being used.

## Core Principle

Model the **semantic category of the problem** in the smallest reasonable layer, then let Laravel render that problem according to the request type.

- Do not invent a project-specific HTTP error framework when Laravel already provides the correct validation and exception behavior.
- Do not use `InvalidArgumentException` as a user-facing contract.
- Do not force a single HTTP error envelope across Inertia page visits and JSON side-channel requests.
- Do not force a "pure DDD" exception model if the current module does not actually have a strong domain model to support it.

This repository is a pragmatic modular monolith. Some modules follow domain-oriented patterns, but many business rules still live close to Eloquent-backed application flows. Because of that, the **application / use-case layer is currently the correct place to classify many user-facing business failures** when they cannot be expressed cleanly in the request layer.

## Request Types

This repository uses two valid transport styles:

- **Inertia page requests**: page visits and form submissions handled through Inertia responses and redirects.
- **JSON side-channel requests**: auxiliary requests handled through `JsonResponse`, typically consumed by `axios`.

The same business rule may be rendered differently depending on the transport. That is expected and correct.

## User-Correctable Errors

If the user can fix the problem by changing submitted input or by retrying the same action with different values, treat it as a **validation concern**.

Preferred mechanisms:

- `FormRequest` rules for request-shape and field-level validation.
- `messages()` and `attributes()` for message clarity.
- `prepareForValidation()` for request-local normalization.
- validator `after()` callbacks for context-aware validation that still belongs to input validation.
- `ValidationException::withMessages(...)` when the rule is only known during application flow and cannot be expressed cleanly in the request rules.

Do not throw `InvalidArgumentException` for these cases.

## Layer Responsibilities

This section defines the practical responsibility split for this codebase as it exists today.

### Controllers

Controllers are responsible for:

- receiving the HTTP request
- delegating request validation to `FormRequest` where applicable
- resolving route models and transport concerns
- calling the use case / application service
- returning the success response

Controllers are **not** responsible for:

- reclassifying business failures based on exception message text
- translating `InvalidArgumentException` into validation or HTTP semantics on a per-endpoint basis
- duplicating business-rule classification already known by the use case

In other words, controllers should stay thin. They own transport, not business-error interpretation.

### Form Requests

`FormRequest` classes are responsible for request-local validation concerns:

- payload shape
- scalar types
- required / nullable / conditional presence
- request-local normalization through `prepareForValidation()`
- request-context-aware validation through validator `after()` hooks when the rule still clearly belongs to input validation

If a rule can be expressed clearly and safely in a `FormRequest`, prefer that.

### Use Cases / Application Services

Use cases are responsible for classifying business-flow failures that are only known during application orchestration.

This is the pragmatic rule for the current codebase.

Examples:

- checking whether a translation already exists
- determining whether a translation target exists for update or delete
- deciding whether a normalized payload is effectively empty
- validating state-dependent business constraints that require repository lookups or orchestration

When those failures are expected to cross the HTTP boundary:

- use `ValidationException::withMessages(...)` for user-correctable validation-style failures
- use a deliberate HTTP exception or equivalent framework mechanism for `404`, `403`, or `409` semantics
- do not use `InvalidArgumentException`

This does introduce some framework awareness into the application layer. In a stricter Clean Architecture / DDD model that would ideally be mediated by application-specific error types. However, this repository does not yet have a strong enough domain-error model to justify adding an extra abstraction layer solely for that purpose.

Therefore, **direct use of Laravel validation / HTTP exceptions inside use cases is acceptable in this project when it avoids fake abstraction and keeps semantics consistent**.

### Global Exception Handling

`bootstrap/app.php` should only handle cross-cutting rendering behavior.

Good examples:

- shared rendering policy for a custom rich-text validation exception
- deciding when a request should render JSON
- global logging or reporting policy

Bad examples:

- teaching the global handler how to interpret module-specific business rules one by one
- depending on global message matching to classify endpoint semantics

## Transport-Specific Rendering

### Inertia Page Requests

For Inertia form submissions and page actions:

- validation errors should flow through Laravel validation
- the server should redirect back
- errors should be flashed to session storage
- the client should consume them through Inertia props / form helpers

In other words, Inertia-facing form validation should behave like standard Laravel validation, not like a manually parsed JSON API.

### JSON Side-Channel Requests

For standalone JSON endpoints:

- user-correctable errors should still be represented as Laravel validation
- the rendered response should be an HTTP `422`
- the response body should use Laravel's validation structure with `message` and `errors`

For these endpoints, `errors` is the contract. `message` is a summary, not the primary parsing mechanism.

## Status Code Guidance

Use the narrowest status code that matches the semantics of the problem.

### `422 Unprocessable Entity`

Use `422` when the request is syntactically valid, but the submitted data fails a user-correctable rule.

Examples:

- required field combinations
- unsupported locale submitted by a form
- locale equal to the base locale when that choice is disallowed
- duplicate translation locale on create
- empty translated payload after normalization

### `404 Not Found`

Use `404` when the addressed resource does not exist in the sense of the request contract.

Examples:

- updating or deleting a translation that does not exist
- loading a missing details resource

Do not downgrade a real missing-resource condition into a validation message only because the UI can recover from it.

### `403 Forbidden`

Use `403` for authorization failures. Prefer Laravel's built-in authorization mechanisms and exceptions.

### `409 Conflict`

Use `409` when the request conflicts with the current server state and the problem is better described as a state conflict than a validation failure.

This should be used deliberately, not as a generic fallback.

### `500` and Other Server Errors

Use server-error status codes for non-correctable failures such as infrastructure, unexpected state, or programming mistakes.

These are not part of the user-input contract and should not be disguised as validation.

## `InvalidArgumentException`

`InvalidArgumentException` is allowed for internal programming mistakes and low-level invariants, but it is **not** a valid public error contract for module HTTP flows.

Appropriate examples:

- unsupported internal mapper usage
- impossible enum/value-object construction paths caused by programmer input
- misuse of internal helpers and services

Inappropriate examples:

- a submitted translation locale already exists
- a translation payload is empty after trimming
- a submitted form value violates a known business rule

If the exception is expected to cross an HTTP boundary and inform the user, it should be represented as Laravel validation or a deliberate HTTP exception before it reaches the response layer.

## Where Validation Logic Should Live

Use the smallest layer that can express the rule clearly without losing safety.

### Prefer `FormRequest` for:

- field format
- allowed scalar values
- required / nullable / conditional field presence
- route-aware request validation

### Prefer validator `after()` or `ValidationException::withMessages(...)` for:

- cross-field rules
- request-context-dependent validation
- checks that require repository lookups or normalized data
- rules discovered during application orchestration

### Prefer the use case / application layer for:

- business-rule validation that cannot be expressed cleanly in `FormRequest`
- checks that depend on current persistence state
- orchestration-time decisions about whether the failure is `422`, `404`, or `409`
- keeping the controller free from rule interpretation

### Do not force controller-level translation as the default

If the use case already knows that a failure is "duplicate translation", "translation not found", or "empty payload after normalization", the controller should not rediscover that meaning by catching a generic exception and guessing.

## Error Keys

When returning validation errors:

- use the real field name whenever the problem maps clearly to a field
- use a stable global key such as `_global` when the rule has no single field owner

Avoid fragile message-only contracts when the frontend needs to distinguish field errors from global errors.

## Frontend Contract Expectations

Backend code should assume:

- Inertia page forms consume flashed validation errors through page props / form helpers
- JSON side-channel consumers expect `422` validation payloads and should parse `errors`, not depend on incidental exception messages

This convention intentionally supports both transports without forcing them into the same HTTP shape.

## Recommended Patterns

- Use Laravel validation as the canonical representation for user-correctable input errors.
- Let `FormRequest` own request-shape validation.
- Let use cases own business-flow error classification when the request layer is not enough.
- Let Laravel render validation according to the request transport.
- Use built-in HTTP exceptions or explicit status-code rendering for `404`, `403`, and `409` cases.
- Keep exception mapping centralized in `bootstrap/app.php` when shared rendering behavior is needed.

## Anti-Patterns

- Throwing `InvalidArgumentException` from use cases as a user-facing validation contract.
- Making controllers parse or reinterpret generic exceptions to recover business semantics.
- Parsing `response.data.message` as the primary frontend contract for validation.
- Creating a custom shared exception framework that duplicates Laravel validation semantics without adding clear value.
- Forcing all errors into `422` regardless of whether the real semantics are validation, authorization, not-found, or server failure.

## Adoption Rule

When touching an existing flow:

1. Identify whether the endpoint is an Inertia page flow or a JSON side-channel.
2. Put request-shape rules in `FormRequest` when possible.
3. Let the use case classify the remaining failure as validation, not-found, authorization, conflict, or server error.
4. Convert user-correctable failures to Laravel validation and missing resources to deliberate HTTP exceptions.
5. Avoid introducing new `InvalidArgumentException` usage for HTTP-facing business rules.

This repository should gradually converge on these conventions as affected modules are updated.
