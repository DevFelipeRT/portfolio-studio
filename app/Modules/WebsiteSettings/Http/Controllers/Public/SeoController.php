<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Http\Controllers\Public;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\WebsiteSettings\Application\Services\SeoSettingsResolver;
use App\Modules\WebsiteSettings\Application\Services\SitemapBuilder;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class SeoController extends Controller
{
    public function __construct(
        private readonly WebsiteSettingsService $settingsService,
        private readonly SeoSettingsResolver $seoResolver,
        private readonly SitemapBuilder $sitemapBuilder,
    ) {
    }

    public function robots(Request $request): Response
    {
        $settings = $this->settingsService->getSettings();
        $directives = $this->seoResolver->resolveRobots('public');

        $lines = [
            'User-agent: *',
        ];

        if (!$settings->public_scope_enabled || !$directives['index']) {
            $lines[] = 'Disallow: /';
        } else {
            $lines[] = 'Allow: /';
        }

        $baseUrl = $settings->canonical_base_url;

        if (!is_string($baseUrl) || $baseUrl === '') {
            $baseUrl = $request->getSchemeAndHttpHost();
        }

        $lines[] = 'Sitemap: ' . rtrim($baseUrl, '/') . '/sitemap.xml';

        return response(implode("\n", $lines), 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }

    public function sitemap(Request $request): Response
    {
        $settings = $this->settingsService->getSettings();
        $baseUrl = $settings->canonical_base_url;

        if (!is_string($baseUrl) || $baseUrl === '') {
            $baseUrl = $request->getSchemeAndHttpHost();
        }

        $xml = $this->sitemapBuilder->build($baseUrl);

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
