<?php

namespace App\Http\Middleware;

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
        return [
            ...parent::share($request),

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
                'supportedLocales' => config('localization.supported_locales', []),
                'defaultLocale' => config('app.locale'),
                'fallbackLocale' => config('app.fallback_locale'),
            ],
        ];
    }
}
