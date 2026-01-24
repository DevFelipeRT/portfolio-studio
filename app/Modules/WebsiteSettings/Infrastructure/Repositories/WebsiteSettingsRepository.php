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

        $defaultLocale = $this->resolveDefaultLocale($defaults);
        $fallbackLocale = $this->resolveFallbackLocale($defaults, $defaultLocale);
        $contentLocale = $defaultLocale === 'auto'
            ? (string) config('app.locale', 'en')
            : $defaultLocale;

        $siteName = $defaults['site_name'] ?? [];
        $siteDescription = $defaults['site_description'] ?? [];
        $defaultMetaTitle = $defaults['default_meta_title'] ?? [];
        $defaultMetaDescription = $defaults['default_meta_description'] ?? [];

        if ($siteName === [] || $defaultMetaTitle === []) {
            $appName = (string) config('app.name', 'Website');

            $siteName[$contentLocale] = $siteName[$contentLocale] ?? $appName;
            $defaultMetaTitle[$contentLocale] = $defaultMetaTitle[$contentLocale] ?? $appName;
        }

        if ($siteDescription === [] || $defaultMetaDescription === []) {
            $siteDescription[$contentLocale] ??= '';
            $defaultMetaDescription[$contentLocale] ??= '';
        }

        return [
            'site_name' => $siteName,
            'site_description' => $siteDescription,
            'owner_name' => $defaults['owner_name'] ?? null,
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
     */
    private function resolveDefaultLocale(array $defaults): string
    {
        $defaultLocale = $defaults['default_locale'] ?? null;

        if (!is_string($defaultLocale) || $defaultLocale === '') {
            $defaultLocale = (string) config('app.locale', 'en');
        }

        return $defaultLocale;
    }

    /**
     * @param array<string,mixed> $defaults
     */
    private function resolveFallbackLocale(
        array $defaults,
        string $defaultLocale,
    ): string {
        $fallbackLocale = $defaults['fallback_locale'] ?? null;

        if (!is_string($fallbackLocale) || $fallbackLocale === '') {
            $fallbackLocale = (string) config('app.fallback_locale', $defaultLocale);
        }

        return $fallbackLocale;
    }
}
