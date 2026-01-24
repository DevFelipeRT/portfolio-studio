<?php

namespace App\Modules\SystemLocale\Http\Controllers;

use App\Modules\SystemLocale\Application\Services\SystemLocaleService;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SystemLocaleController extends Controller
{
    /**
     * Persists the user's selected system locale in a secure cookie.
     */
    public function set(Request $request): JsonResponse
    {
        $systemLocale = app(SystemLocaleService::class);
        $supported = $systemLocale->getSupportedLocales();
        $default = $systemLocale->getDefaultLocale();
        $locale = $request->input('locale', $default);

        if (!is_string($locale) || !in_array($locale, $supported, true)) {
            $locale = $default;
        }

        $cookieName = config('localization.system_cookie_name', 'system_locale');
        $minutes = 60 * 24 * 30;

        return response()->json(['locale' => $locale])
            ->cookie($cookieName, $locale, $minutes, '/', null, config('app.env') === 'production', true);
    }
}
