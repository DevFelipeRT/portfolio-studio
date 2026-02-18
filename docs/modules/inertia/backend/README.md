# Inertia (Backend)

Scope: the server-side integration points for the Inertia + React UI, including shared props and locale behavior.

Evidence:

- Middleware: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`
- Middleware wiring (web stack): `bootstrap/app.php`
- Root view (CSR payload embedding): `resources/views/app.blade.php`
- Inertia SSR config (disabled by default): `config/inertia.php`
- Ziggy integration: `resources/views/app.blade.php`, `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`

## Middleware placement

`HandleInertiaRequests` is appended to the `web` middleware stack in `bootstrap/app.php`, so it runs for web requests and can share props for all Inertia responses (`bootstrap/app.php`).

## Root view and CSR initial payload

The middleware defines the Inertia root view as `app` (`protected $rootView = 'app'`) (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`).

The corresponding Blade view embeds the initial page JSON:

- `<script id="inertia-page" type="application/json">@json($page)</script>` (`resources/views/app.blade.php`)

This supports client-side rendering by default; SSR is configurable but disabled by default (`config/inertia.php`).

## Shared props

`HandleInertiaRequests::share(...)` adds shared props used across the frontend (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`):

- `appName` (from `config('app.name')`)
- `websiteSettings` (subset of `WebsiteSettingsService::getSettings()` fields)
- `auth.user` (current authenticated user)
- `ziggy` (routes + current location) via `Tighten\Ziggy\Ziggy`
- `locale` (current Laravel locale)
- `localization` (a structured payload the frontend uses for language selection and persistence)

## Public vs system locale behavior

The middleware distinguishes “public content” routes by route name (`home` or `content.*`) (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`).

For public content routes:

- locale is resolved via `PublicPageLocaleResolver` / `WebsiteLocaleResolver`
- `supportedLocales` comes from `PageService::listLocales()`
- cookie name switches to `config('localization.public_cookie_name')` (default `public_locale`)
- persistence endpoint switches to `/set-locale`
- `persistClientCookie` is set to `true` (frontend may set a client cookie) (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`)

For non-public (admin/system) routes:

- locale metadata is based on `SystemLocaleService`
- cookie name is `config('localization.system_cookie_name')` (default `system_locale`)
- persistence endpoint is `/system/locale`
- `persistClientCookie` is set to `false` (system locale cookie is expected to be set by the backend) (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`)

