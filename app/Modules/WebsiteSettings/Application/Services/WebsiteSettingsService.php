<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\Services;

use App\Modules\WebsiteSettings\Domain\Models\WebsiteSettings;
use App\Modules\WebsiteSettings\Domain\Repositories\IWebsiteSettingsRepository;
use Illuminate\Support\Facades\Cache;

final class WebsiteSettingsService
{
    private const string CACHE_KEY = 'website_settings.current';
    private const int CACHE_SECONDS = 60;

    public function __construct(private readonly IWebsiteSettingsRepository $repository)
    {
    }

    public function getSettings(): WebsiteSettings
    {
        return Cache::remember(
            self::CACHE_KEY,
            self::CACHE_SECONDS,
            fn() => $this->repository->get(),
        );
    }

    public function forgetCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @return array<int,string>
     */
    public function getSupportedLocales(): array
    {
        $settings = $this->getSettings();
        $supported = $settings->supported_locales ?? [];

        if (!is_array($supported) || $supported === []) {
            $supported = config('localization.supported_locales', []);
        }

        if (!is_array($supported) || $supported === []) {
            $supported = [(string) config('app.locale', 'en')];
        }

        return array_values(array_filter(array_map('trim', $supported)));
    }

    public function getDefaultLocale(): string
    {
        $settings = $this->getSettings();
        $default = $settings->default_locale;

        if (!is_string($default) || $default === '') {
            $default = (string) config('app.locale', 'en');
        }

        $supported = $this->getSupportedLocales();

        if ($supported !== [] && !in_array($default, $supported, true)) {
            $default = $supported[0];
        }

        return $default;
    }

    public function getFallbackLocale(): string
    {
        $settings = $this->getSettings();
        $fallback = $settings->fallback_locale;

        if (!is_string($fallback) || $fallback === '') {
            $fallback = (string) config('app.fallback_locale', $this->getDefaultLocale());
        }

        $supported = $this->getSupportedLocales();

        if ($supported !== [] && !in_array($fallback, $supported, true)) {
            $fallback = $supported[0];
        }

        return $fallback;
    }

    public function getLocalizedValue(?array $map, string $locale, ?string $fallbackLocale = null): ?string
    {
        if ($map === null || $map === []) {
            return null;
        }

        $fallbackLocale = $fallbackLocale ?: $this->getFallbackLocale();

        if (isset($map[$locale]) && is_string($map[$locale]) && $map[$locale] !== '') {
            return $map[$locale];
        }

        if (isset($map[$fallbackLocale]) && is_string($map[$fallbackLocale]) && $map[$fallbackLocale] !== '') {
            return $map[$fallbackLocale];
        }

        foreach ($map as $value) {
            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }
}
