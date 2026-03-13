<?php

namespace App\Modules\Inertia\Http\Middleware;

use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Application\Services\PublicPageLocaleResolver;
use App\Modules\Inertia\Domain\Enums\InertiaLocalizationScope;
use App\Modules\SystemLocale\Application\Services\SystemLocaleService;
use App\Modules\WebsiteSettings\Application\Services\WebsiteLocaleResolver;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
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
        $websiteSettings = app(WebsiteSettingsService::class);
        $systemLocale = app(SystemLocaleService::class);
        $websiteLocaleResolver = app(WebsiteLocaleResolver::class);
        $pageService = app(PageService::class);
        $publicPageLocaleResolver = app(PublicPageLocaleResolver::class);
        $settings = $websiteSettings->getSettings();

        $isPublicContent = $this->isPublicContentRoute($request);
        $localizationScope = $isPublicContent
            ? InertiaLocalizationScope::Public
            : InertiaLocalizationScope::System;
        $currentLocale = app()->getLocale();
        $supportedLocales = $systemLocale->getSupportedLocales();
        $defaultLocale = $systemLocale->getDefaultLocale();
        $fallbackLocale = $systemLocale->getFallbackLocale();
        $cookieName = config('localization.system_cookie_name', 'system_locale');
        $apiEndpoint = '/system/locale';
        $persistClientCookie = false;

        if ($isPublicContent) {
            $currentLocale = $this->resolvePublicLocale(
                $request,
                $publicPageLocaleResolver,
                $websiteLocaleResolver,
            );
            App::setLocale($currentLocale);
            $supportedLocales = $pageService->listLocales();
            $defaultLocale = $websiteSettings->getDefaultLocale();
            $fallbackLocale = $websiteSettings->getFallbackLocale();
            if ($defaultLocale === 'auto') {
                $defaultLocale = $currentLocale;
            }
            $cookieName = config('localization.public_cookie_name', 'public_locale');
            $apiEndpoint = '/set-locale';
            $persistClientCookie = true;
        }

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

            // Current locale resolved by SystemLocale (and refined for public content routes).
            'locale' => fn() => app()->getLocale(),

            // Localization metadata for the front-end.
            'localization' => fn() => [
                'scope' => $localizationScope->value,
                'currentLocale' => app()->getLocale(),
                'supportedLocales' => $supportedLocales,
                'defaultLocale' => $defaultLocale,
                'fallbackLocale' => $fallbackLocale,
                'cookieName' => $cookieName,
                'apiEndpoint' => $apiEndpoint,
                'persistClientCookie' => $persistClientCookie,
            ],
        ];
    }

    private function isPublicContentRoute(Request $request): bool
    {
        $route = $request->route();

        if ($route === null) {
            return false;
        }

        $middlewares = $route->gatherMiddleware();

        foreach ($middlewares as $middleware) {
            if (!is_string($middleware) || $middleware === '') {
                continue;
            }

            // Any authenticated route should use the system locale pipeline.
            // For all other routes (guest-accessible/public website), use the
            // public website locale pipeline.
            if ($middleware === 'auth' || str_starts_with($middleware, 'auth:')) {
                return false;
            }
        }

        return true;
    }

    private function resolvePublicLocale(
        Request $request,
        PublicPageLocaleResolver $publicPageLocaleResolver,
        WebsiteLocaleResolver $websiteLocaleResolver,
    ): string {
        $route = $request->route();

        if ($route === null) {
            return $websiteLocaleResolver->resolveFromRequest($request);
        }

        $name = $route->getName();

        if (!is_string($name) || $name === '') {
            return $websiteLocaleResolver->resolveFromRequest($request);
        }

        if ($name === 'home') {
            return $publicPageLocaleResolver->resolveForHome($request);
        }

        if (str_starts_with($name, 'content.')) {
            $slug = $route->parameter('slug');

            if (is_string($slug) && $slug !== '') {
                return $publicPageLocaleResolver->resolveForSlug($request, $slug);
            }
        }

        return $websiteLocaleResolver->resolveFromRequest($request);
    }
}
