<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services;

use App\Modules\WebsiteSettings\Application\Services\WebsiteLocaleResolver;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;
use Illuminate\Http\Request;

final class PublicPageLocaleResolver
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly ContentSettingsService $contentSettings,
        private readonly WebsiteSettingsService $websiteSettings,
        private readonly WebsiteLocaleResolver $websiteLocaleResolver,
    ) {
    }

    public function resolveForSlug(Request $request, string $slug): string
    {
        $requested = $this->websiteLocaleResolver->resolveFromRequest($request);

        $fallback = $this->websiteSettings->getFallbackLocale();
        $default = $this->websiteSettings->getDefaultLocale();

        $candidates = array_values(array_unique(array_filter([
            $requested,
            $fallback,
            $default !== 'auto' ? $default : null,
        ])));

        foreach ($candidates as $locale) {
            if ($this->pageService->getBySlugAndLocale($slug, $locale) !== null) {
                return $locale;
            }
        }

        return $requested;
    }

    public function resolveForHome(Request $request): string
    {
        $homeSlug = $this->contentSettings->getHomeSlug();

        return $this->resolveForSlug($request, $homeSlug);
    }
}
