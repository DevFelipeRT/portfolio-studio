<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\Services;

use App\Modules\ContentManagement\Application\Services\ContentSettingsService;
use App\Modules\ContentManagement\Domain\Models\Page;

final class SitemapBuilder
{
    public function __construct(
        private readonly WebsiteSettingsService $settingsService,
        private readonly ContentSettingsService $contentSettings,
    ) {
    }

    public function build(string $baseUrl): string
    {
        $settings = $this->settingsService->getSettings();

        if (!$settings->public_scope_enabled) {
            return $this->wrapUrlset([]);
        }

        $robots = is_array($settings->robots) ? $settings->robots : [];
        $publicIndex = $robots['public']['index'] ?? true;

        if (!$publicIndex) {
            return $this->wrapUrlset([]);
        }

        $baseUrl = rtrim($baseUrl, '/');

        $pages = Page::query()
            ->where('is_published', true)
            ->where('is_indexable', true)
            ->get();

        $homeSlug = $this->contentSettings->getHomeSlug();
        $items = [];

        foreach ($pages as $page) {
            $path = $page->slug === $homeSlug
                ? '/'
                : '/content/' . $page->slug;

            $loc = $baseUrl . $path;

            $items[] = [
                'loc' => $loc,
                'lastmod' => $page->updated_at?->toAtomString(),
            ];
        }

        return $this->wrapUrlset($items);
    }

    /**
     * @param array<int,array{loc:string,lastmod:?string}> $items
     */
    private function wrapUrlset(array $items): string
    {
        $lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        $unique = [];

        foreach ($items as $item) {
            $loc = $item['loc'];

            if (isset($unique[$loc])) {
                continue;
            }

            $unique[$loc] = true;

            $lines[] = '  <url>';
            $lines[] = '    <loc>' . $this->escapeXml($loc) . '</loc>';

            if (!empty($item['lastmod'])) {
                $lines[] = '    <lastmod>' . $this->escapeXml($item['lastmod']) . '</lastmod>';
            }

            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines);
    }

    private function escapeXml(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
