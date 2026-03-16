# System Locale (Frontend)

Scope: UI-level language switching for authenticated/admin pages using the system locale endpoint.

Evidence:

- Shared localization props source: `app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`
- Locale switcher UI: `resources/js/common/locale/react/LocaleSwitcher.tsx`, `resources/js/common/i18n/react/LanguageSelector.tsx`
- Locale persistence hook: `resources/js/common/locale/react/useSetLocale.tsx`
- i18n-aware preload/apply hook: `resources/js/common/i18n/react/hooks/useSetI18nLocale.tsx`
- Admin header integration: `resources/js/app/layouts/partials/Header.tsx`

## Where the switcher appears

The authenticated layout header renders the system language selector (`resources/js/app/layouts/partials/Header.tsx`):

- `LocaleSwitcher`

## Data source (Inertia shared props)

The backend exposes the active request locale pipeline through `page.props.localization.scope = 'system'` for authenticated/admin requests, and `resources/js/app/shell/runtime/localizationContext.ts` normalizes that into the runtime context consumed by the admin header.

`LocaleSwitcher` receives the resolved system-locale persistence policy from that normalized Inertia context and uses:

- `supportedLocales` to build the dropdown options
- `cookieName` to optionally persist client-side cookies (see below)
- `apiEndpoint` as the POST target for locale persistence (`resources/js/common/locale/react/LocaleSwitcher.tsx`).

The raw shared props still come from the backend Inertia middleware (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`), but request-context normalization now lives at the Inertia frontend boundary instead of inside `common/locale`.

## Persistence + reload behavior

When the user selects a locale, the container delegates to `useSetLocale`, which:

1. Resolves the requested locale against the supported locale list
2. Preloads shared and current-page scoped translation bundles
3. Applies the locale in the client i18next runtime when immediate application is enabled
4. POSTs `{ locale: "<code>" }` to `apiEndpoint` with CSRF header
5. Reloads the current page via Inertia GET after a short debounce, preserving scroll/state

Evidence:

- Base locale switching flow: `resources/js/common/locale/react/useSetLocale.tsx`
- i18n-aware preload/apply integration: `resources/js/common/i18n/react/hooks/useSetI18nLocale.tsx`
- Admin reload behavior: `resources/js/app/layouts/partials/Header.tsx`

## Why `persistClientCookie` is disabled for system locale

For authenticated/admin requests, the backend sets `localization.persistClientCookie = false` and `localization.apiEndpoint = '/system/locale'` (`app/Modules/Inertia/Http/Middleware/HandleInertiaRequests.php`).

This matches the backend cookie policy for the system locale: the cookie is HTTP-only and should be set server-side by `POST /system/locale` (`app/Modules/SystemLocale/Http/Controllers/SystemLocaleController.php`).
