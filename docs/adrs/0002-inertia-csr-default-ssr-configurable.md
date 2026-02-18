# ADR 0002: Inertia CSR by Default, SSR Configurable

## Status

Accepted (evident in current codebase).

## Context

The application uses Inertia for a React-based UI while keeping Laravel routing/controllers on the backend. The initial page visit needs to work without requiring a separate SSR runtime.

## Decision

Use client-side rendering (CSR) by default for the initial visit:

- The initial page payload is embedded into the root Blade view (`resources/views/app.blade.php`) and read by the client at boot time (`resources/js/app/inertia/InertiaApp.tsx`).
- Inertia SSR exists as a configurable option but is disabled by default via `config/inertia.php`.

## Consequences

- No separate SSR service is required for local development by default.
- The initial render depends on client execution; SEO-sensitive behavior is handled via dedicated endpoints (e.g. `robots.txt`, `sitemap.xml`) rather than SSR.

## Evidence

- SSR config default: `config/inertia.php`
- Root payload embedding: `resources/views/app.blade.php`
- Client boot reading initial page: `resources/js/app/inertia/InertiaApp.tsx`
- SEO endpoints: `app/Modules/WebsiteSettings/Routes/public.php`

