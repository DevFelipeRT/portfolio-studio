<?php

declare(strict_types=1);

namespace App\Modules\SystemLocale\Application\Services;

final class SystemLocaleService
{
    /**
     * @return array<int,string>
     */
    public function getSupportedLocales(): array
    {
        $supported = config('localization.supported_locales', []);

        if (!is_array($supported) || $supported === []) {
            $supported = [(string) config('app.locale', 'en')];
        }

        return array_values(array_filter(array_map('trim', $supported)));
    }

    public function getDefaultLocale(): string
    {
        $default = (string) config('app.locale', 'en');
        $supported = $this->getSupportedLocales();

        if ($supported !== [] && !in_array($default, $supported, true)) {
            $default = $supported[0];
        }

        return $default;
    }

    public function getFallbackLocale(): string
    {
        $fallback = (string) config('app.fallback_locale', $this->getDefaultLocale());
        $supported = $this->getSupportedLocales();

        if ($supported !== [] && !in_array($fallback, $supported, true)) {
            $fallback = $supported[0];
        }

        return $fallback;
    }
}
