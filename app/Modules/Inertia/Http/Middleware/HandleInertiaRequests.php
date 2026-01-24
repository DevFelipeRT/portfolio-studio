<?php

namespace App\Modules\Inertia\Http\Middleware;

use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settingsService = app(WebsiteSettingsService::class);
        $settings = $settingsService->getSettings();

        return [
            ...parent::share($request),

            'appName' => fn() => config('app.name'),
            'websiteSettings' => fn() => [
                'siteName' => $settings->site_name,
                'ownerName' => $settings->owner_name,
                'metaTitleTemplate' => $settings->meta_title_template,
                'defaultMetaTitle' => $settings->default_meta_title,
            ],

            'auth' => [
                'user' => $request->user(),
            ],

            'ziggy' => fn() => [
                ...(new Ziggy())->toArray(),
                'location' => $request->url(),
            ],

            // Current locale resolved by ResolveLocale middleware.
            'locale' => fn() => app()->getLocale(),

            // Localization metadata for the front-end.
            'localization' => fn() => [
                'currentLocale' => app()->getLocale(),
                'supportedLocales' => $settingsService->getSupportedLocales(),
                'defaultLocale' => $settingsService->getDefaultLocale(),
                'fallbackLocale' => $settingsService->getFallbackLocale(),
            ],
        ];
    }
}
