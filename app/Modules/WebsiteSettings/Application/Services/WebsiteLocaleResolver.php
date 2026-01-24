<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

final class WebsiteLocaleResolver
{
    public function __construct(private readonly WebsiteSettingsService $settingsService)
    {
    }

    public function resolveFromRequest(Request $request): string
    {
        $default = $this->settingsService->getDefaultLocale();
        $defaultIsAuto = $default === 'auto';

        if (!$defaultIsAuto) {
            $candidates = [
                $this->localeFromRoute($request),
                $this->localeFromCookie($request),
                $default,
            ];

            foreach ($candidates as $candidate) {
                if ($candidate === null) {
                    continue;
                }

                $normalized = $this->normalizeLocale($candidate);

                return $normalized;
            }

            return $default;
        }

        $candidates = [
            $this->localeFromRoute($request),
            $this->localeFromCookie($request),
            $this->localeFromSystem(),
            $this->localeFromHeader($request),
        ];

        foreach ($candidates as $candidate) {
            if ($candidate === null) {
                continue;
            }

            $normalized = $this->normalizeLocale($candidate);

            return $normalized;
        }

        if (!$defaultIsAuto) {
            return $default;
        }

        return (string) config('app.locale', 'en');
    }

    private function localeFromRoute(Request $request): ?string
    {
        $parameter = Config::get('localization.route_parameter', 'locale');

        $value = $request->route($parameter);

        if (!is_string($value) || $value === '') {
            return null;
        }

        return $value;
    }

    private function localeFromCookie(Request $request): ?string
    {
        $cookieName = $this->cookieName();
        $value = $request->cookie($cookieName);

        if (!is_string($value) || $value === '') {
            return null;
        }

        return $value;
    }

    private function localeFromSystem(): ?string
    {
        $systemLocale = app()->getLocale();

        if (!is_string($systemLocale) || $systemLocale === '') {
            return null;
        }

        return $systemLocale;
    }

    private function localeFromHeader(Request $request): ?string
    {
        $preferred = $request->getPreferredLanguage();

        if (!is_string($preferred) || $preferred === '') {
            return null;
        }

        return $preferred;
    }

    private function cookieName(): string
    {
        $name = Config::get('localization.public_cookie_name', 'public_locale');

        if (!is_string($name) || $name === '') {
            return 'public_locale';
        }

        return $name;
    }

    private function normalizeLocale(string $locale): string
    {
        return trim($locale);
    }

}
