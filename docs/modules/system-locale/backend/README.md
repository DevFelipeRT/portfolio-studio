# System Locale (Backend)

Scope: resolving the application locale for authenticated/admin requests and persisting the chosen locale as a secure cookie.

Evidence:

- Middleware: `app/Modules/SystemLocale/Http/Middleware/ResolveSystemLocale.php`
- Locale service: `app/Modules/SystemLocale/Application/Services/SystemLocaleService.php`
- Persistence endpoint: `routes/web.php`, `app/Modules/SystemLocale/Http/Controllers/SystemLocaleController.php`
- Web middleware stack wiring: `bootstrap/app.php`
- Localization config: `config/localization.php`
- Inertia shared props behavior: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

## Concepts

This project distinguishes between:

- **System locale**: used for authenticated/admin UX; persisted under `config('localization.system_cookie_name')` (default `system_locale`) (`config/localization.php`, `app/Modules/SystemLocale/Http/Middleware/ResolveSystemLocale.php`).
- **Public locale**: used for the public site and content pages; persisted separately via `POST /set-locale` (handled by WebsiteSettings) (`routes/web.php`, `app/Modules/WebsiteSettings/Http/Controllers/PublicLocaleController.php`).

This document covers the system/admin side.

## Where locale is applied

`ResolveSystemLocale` is appended to the global `web` middleware stack in `bootstrap/app.php`, so it runs on web requests before Inertia props are shared (`bootstrap/app.php`).

It sets:

- `config('app.locale')` to the resolved default locale
- `config('app.fallback_locale')` and `App::setFallbackLocale(...)`
- `App::setLocale(...)` to the resolved locale (`app/Modules/SystemLocale/Http/Middleware/ResolveSystemLocale.php`).

## Supported locales and defaults

Supported locales are configured in `config/localization.php` (`supported_locales`), with a fallback to `config('app.locale')` when the list is empty/invalid (`app/Modules/SystemLocale/Application/Services/SystemLocaleService.php`, `config/localization.php`).

## Resolution order (system locale)

The middleware resolves the locale by checking the first supported candidate in this order (`app/Modules/SystemLocale/Http/Middleware/ResolveSystemLocale.php`):

1. Route parameter (name from `config('localization.route_parameter')`, default `locale`)
2. Authenticated user field `preferred_locale` (only if present on the user model)
3. Cookie (only for authenticated users)
4. `Accept-Language` header (restricted to supported locales)
5. Default locale (first supported locale, or `app.locale`)

## Persistence behavior (cookie)

The middleware persists a cookie only for authenticated users and only when the locale changes (`app/Modules/SystemLocale/Http/Middleware/ResolveSystemLocale.php`):

- Cookie name: `config('localization.system_cookie_name')` (default `system_locale`) (`config/localization.php`)
- Max age: 30 days
- Secure flag: `true` only when `app.env === production`
- HTTP-only: `true`

## Explicit persistence endpoint

There is a dedicated endpoint to set the system locale cookie:

- `POST /system/locale` (authenticated) (`routes/web.php`)

Controller behavior (`app/Modules/SystemLocale/Http/Controllers/SystemLocaleController.php`):

- Reads `locale` from request JSON/body (falls back to default)
- Validates locale is in the supported list; otherwise uses the default
- Returns JSON `{"locale": "<resolved>"}` and sets the cookie (HTTP-only, secure in production)

## Inertia integration

For authenticated/admin routes, the Inertia shared props include:

- `localization.cookieName` set to the system cookie name
- `localization.apiEndpoint` set to `/system/locale`
- `localization.persistClientCookie` set to `false` (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`)

This is intended to let the frontend update locale via the API while leaving cookie persistence to the backend (system locale cookie is HTTP-only).

