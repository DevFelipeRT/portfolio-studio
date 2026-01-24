<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Infrastructure\Repositories;

use App\Modules\WebsiteSettings\Domain\Models\WebsiteSettings;
use App\Modules\WebsiteSettings\Domain\Repositories\IWebsiteSettingsRepository;

final class WebsiteSettingsRepository implements IWebsiteSettingsRepository
{
    public function get(): WebsiteSettings
    {
        $settings = WebsiteSettings::query()->first();

        if ($settings !== null) {
            return $settings;
        }

        $settings = new WebsiteSettings($this->defaultAttributes());
        $settings->save();

        return $settings;
    }

    public function update(WebsiteSettings $settings, array $attributes): WebsiteSettings
    {
        $settings->fill($attributes);
        $settings->save();

        return $settings;
    }

    /**
     * @return array<string,mixed>
     */
    private function defaultAttributes(): array
    {
        $defaults = (array) config('website_settings.defaults', []);

        $supportedLocales = $this->resolveSupportedLocales($defaults);
        $defaultLocale = $this->resolveDefaultLocale($defaults, $supportedLocales);
        $fallbackLocale = $this->resolveFallbackLocale($defaults, $supportedLocales, $defaultLocale);

        $siteName = $defaults['site_name'] ?? [];
        $siteDescription = $defaults['site_description'] ?? [];
        $defaultMetaTitle = $defaults['default_meta_title'] ?? [];
        $defaultMetaDescription = $defaults['default_meta_description'] ?? [];

        if ($siteName === [] || $defaultMetaTitle === []) {
            $appName = (string) config('app.name', 'Website');

            foreach ($supportedLocales as $locale) {
                if (!isset($siteName[$locale])) {
                    $siteName[$locale] = $appName;
                }

                if (!isset($defaultMetaTitle[$locale])) {
                    $defaultMetaTitle[$locale] = $appName;
                }
            }
        }

        if ($siteDescription === [] || $defaultMetaDescription === []) {
            foreach ($supportedLocales as $locale) {
                $siteDescription[$locale] ??= '';
                $defaultMetaDescription[$locale] ??= '';
            }
        }

        return [
            'site_name' => $siteName,
            'site_description' => $siteDescription,
            'owner_name' => $defaults['owner_name'] ?? null,
            'supported_locales' => $supportedLocales,
            'default_locale' => $defaultLocale,
            'fallback_locale' => $fallbackLocale,
            'canonical_base_url' => $defaults['canonical_base_url'] ?? null,
            'meta_title_template' => $defaults['meta_title_template'] ?? '{page_title} | {owner} | {site}',
            'default_meta_title' => $defaultMetaTitle,
            'default_meta_description' => $defaultMetaDescription,
            'robots' => $defaults['robots'] ?? [],
            'system_pages' => $defaults['system_pages'] ?? [],
            'institutional_links' => $defaults['institutional_links'] ?? [],
            'public_scope_enabled' => (bool) ($defaults['public_scope_enabled'] ?? true),
            'private_scope_enabled' => (bool) ($defaults['private_scope_enabled'] ?? true),
        ];
    }

    /**
     * @param array<string,mixed> $defaults
     * @return array<int,string>
     */
    private function resolveSupportedLocales(array $defaults): array
    {
        $supported = $defaults['supported_locales'] ?? [];

        if (!is_array($supported) || $supported === []) {
            $supported = config('localization.supported_locales', []);
        }

        if (!is_array($supported) || $supported === []) {
            $supported = [(string) config('app.locale', 'en')];
        }

        return array_values(array_filter(array_map('trim', $supported)));
    }

    /**
     * @param array<string,mixed> $defaults
     * @param array<int,string> $supportedLocales
     */
    private function resolveDefaultLocale(array $defaults, array $supportedLocales): string
    {
        $defaultLocale = $defaults['default_locale'] ?? null;

        if (!is_string($defaultLocale) || $defaultLocale === '') {
            $defaultLocale = (string) config('app.locale', 'en');
        }

        if (!in_array($defaultLocale, $supportedLocales, true) && $supportedLocales !== []) {
            $defaultLocale = $supportedLocales[0];
        }

        return $defaultLocale;
    }

    /**
     * @param array<string,mixed> $defaults
     * @param array<int,string> $supportedLocales
     */
    private function resolveFallbackLocale(
        array $defaults,
        array $supportedLocales,
        string $defaultLocale,
    ): string {
        $fallbackLocale = $defaults['fallback_locale'] ?? null;

        if (!is_string($fallbackLocale) || $fallbackLocale === '') {
            $fallbackLocale = (string) config('app.fallback_locale', $defaultLocale);
        }

        if (!in_array($fallbackLocale, $supportedLocales, true) && $supportedLocales !== []) {
            $fallbackLocale = $supportedLocales[0];
        }

        return $fallbackLocale;
    }
}
