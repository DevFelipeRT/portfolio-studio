<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicLocaleController extends Controller
{
    /**
     * Persists the public website locale in a cookie.
     */
    public function set(Request $request): JsonResponse
    {
        $settingsService = app(WebsiteSettingsService::class);
        $pageService = app(PageService::class);
        $availableLocales = $pageService->listLocales();
        $default = $settingsService->getDefaultLocale();
        $fallback = $settingsService->getFallbackLocale();
        $locale = $request->input('locale', $default);

        if (!is_string($locale) || $locale === '') {
            $locale = $default;
        }

        if ($locale === 'auto') {
            $locale = $fallback ?: (string) config('app.locale', 'en');
        }

        if ($availableLocales !== [] && !in_array($locale, $availableLocales, true)) {
            $locale = $fallback ?: (string) config('app.locale', 'en');
        }

        $cookieName = config('localization.public_cookie_name', 'public_locale');
        $minutes = 60 * 24 * 30;

        return response()->json(['locale' => $locale])
            ->cookie($cookieName, $locale, $minutes, '/', null, config('app.env') === 'production', false);
    }
}
