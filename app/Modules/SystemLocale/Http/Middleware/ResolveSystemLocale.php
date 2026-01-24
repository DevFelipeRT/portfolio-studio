<?php

namespace App\Modules\SystemLocale\Http\Middleware;

use Closure;
use App\Modules\SystemLocale\Application\Services\SystemLocaleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class ResolveSystemLocale
{
    public function __construct(private readonly SystemLocaleService $systemLocale)
    {
    }

    /**
     * Handles the incoming request and configures the application locale.
     */
    public function handle(Request $request, Closure $next): Response
    {
        Config::set('app.locale', $this->systemLocale->getDefaultLocale());
        Config::set('app.fallback_locale', $this->systemLocale->getFallbackLocale());
        App::setFallbackLocale($this->systemLocale->getFallbackLocale());

        $resolvedLocale = $this->resolveLocale($request);

        App::setLocale($resolvedLocale);

        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        $this->persistLocaleCookie($request, $response, $resolvedLocale);

        return $response;
    }

    /**
     * Resolves the most appropriate locale for the current request.
     */
    private function resolveLocale(Request $request): string
    {
        $supported = $this->supportedLocales();
        $default = $this->defaultLocale();

        $candidates = [
            $this->localeFromRoute($request),
            $this->localeFromAuthenticatedUser($request),
            $this->localeFromCookie($request),
            $this->localeFromHeader($request, $supported),
        ];

        foreach ($candidates as $candidate) {
            if ($candidate === null) {
                continue;
            }

            $normalized = $this->normalizeLocale($candidate);

            if ($this->isSupported($normalized, $supported)) {
                return $normalized;
            }
        }

        return $default;
    }

    /**
     * Reads the locale from the route parameter configured in localization settings.
     */
    private function localeFromRoute(Request $request): ?string
    {
        $parameter = Config::get('localization.route_parameter', 'locale');

        $value = $request->route($parameter);

        if (!is_string($value) || $value === '') {
            return null;
        }

        return $value;
    }

    /**
     * Reads the locale from the authenticated user, if available.
     * Adapt the attribute name to match your user model.
     */
    private function localeFromAuthenticatedUser(Request $request): ?string
    {
        $user = $request->user();

        if ($user === null) {
            return null;
        }

        if (!isset($user->preferred_locale)) {
            return null;
        }

        if (!is_string($user->preferred_locale) || $user->preferred_locale === '') {
            return null;
        }

        return $user->preferred_locale;
    }

    /**
     * Reads the locale from the configured cookie, if present.
     */
    private function localeFromCookie(Request $request): ?string
    {
        if ($request->user() === null) {
            return null;
        }

        $cookieName = $this->cookieName();

        $value = $request->cookie($cookieName);

        if (!is_string($value) || $value === '') {
            return null;
        }

        return $value;
    }

    /**
     * Reads the locale from the Accept-Language header, limited to supported locales.
     */
    private function localeFromHeader(Request $request, array $supportedLocales): ?string
    {
        if ($supportedLocales === []) {
            return null;
        }

        $preferred = $request->getPreferredLanguage($supportedLocales);

        if (!is_string($preferred) || $preferred === '') {
            return null;
        }

        return $preferred;
    }

    /**
     * Persists the resolved locale in a cookie when it changes.
     */
    private function persistLocaleCookie(Request $request, Response $response, string $locale): void
    {
        if ($request->user() === null) {
            return;
        }

        $cookieName = $this->cookieName();

        $currentCookie = $request->cookie($cookieName);

        if ($currentCookie === $locale) {
            return;
        }

        $cookie = Cookie::make(
            $cookieName,
            $locale,
            60 * 24 * 30,
            '/',
            null,
            config('app.env') === 'production',
            true
        );

        $response->headers->setCookie($cookie);
    }

    /**
     * Returns the list of supported locales from configuration.
     * Falls back to app.locale when the list is empty or invalid.
     */
    private function supportedLocales(): array
    {
        return $this->systemLocale->getSupportedLocales();
    }

    /**
     * Returns the default locale from application configuration.
     */
    private function defaultLocale(): string
    {
        return $this->systemLocale->getDefaultLocale();
    }

    /**
     * Returns the cookie name used for locale persistence.
     */
    private function cookieName(): string
    {
        $name = Config::get('localization.system_cookie_name', 'system_locale');

        if (!is_string($name) || $name === '') {
            return 'system_locale';
        }

        return $name;
    }

    /**
     * Normalizes a locale string into a consistent representation.
     */
    private function normalizeLocale(string $locale): string
    {
        return trim($locale);
    }

    /**
     * Checks whether a locale is part of the supported set.
     */
    private function isSupported(string $locale, array $supportedLocales): bool
    {
        return in_array($locale, $supportedLocales, true);
    }
}
