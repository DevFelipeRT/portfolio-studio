# System Locale (Frontend)

Scope: UI-level language switching for authenticated/admin pages using the system locale endpoint.

Evidence:

- Shared localization props source: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`
- System language selector container: `resources/js/common/i18n/react/containers/SystemLanguageSelectorContainer.tsx`
- Locale persistence hook: `resources/js/common/i18n/react/hooks/useSetLocale.tsx`
- Admin header integration: `resources/js/app/layouts/partials/Header.tsx`

## Where the switcher appears

The authenticated layout header renders the system language selector (`resources/js/app/layouts/partials/Header.tsx`):

- `SystemLanguageSelectorContainer`

## Data source (Inertia shared props)

`SystemLanguageSelectorContainer` reads `page.props.localization` and uses:

- `supportedLocales` to build the dropdown options
- `cookieName` to optionally persist client-side cookies (see below)
- `apiEndpoint` as the POST target for locale persistence (`resources/js/common/i18n/react/containers/SystemLanguageSelectorContainer.tsx`).

Those props are provided by the backend Inertia middleware (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`).

## Persistence + reload behavior

When the user selects a locale, the container delegates to `useSetLocale`, which:

1. Applies the locale in the client i18n provider (after catalogs load)
2. POSTs `{ locale: "<code>" }` to `apiEndpoint` with CSRF header
3. Reloads the current page via Inertia GET after a short debounce, preserving scroll/state (`resources/js/common/i18n/react/hooks/useSetLocale.tsx`).

## Why `persistClientCookie` is disabled for system locale

For authenticated/admin requests, the backend sets `localization.persistClientCookie = false` and `localization.apiEndpoint = '/system/locale'` (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`).

This matches the backend cookie policy for the system locale: the cookie is HTTP-only and should be set server-side by `POST /system/locale` (`app/Modules/SystemLocale/Http/Controllers/SystemLocaleController.php`).

