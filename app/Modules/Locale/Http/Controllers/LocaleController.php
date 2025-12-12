<?php

namespace App\Modules\Locale\Http\Controllers;

use App\Modules\Shared\Abstractions\Base\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LocaleController extends Controller
{
    /**
     * Persists the user's selected locale in a secure cookie.
     */
    public function set(Request $request): JsonResponse
    {
        $supported = config('localization.supported_locales', [config('app.locale')]);
        $default = config('app.locale', 'en');
        $locale = $request->input('locale', $default);

        if (!is_string($locale) || !in_array($locale, $supported, true)) {
            $locale = $default;
        }

        $cookieName = config('localization.cookie_name', 'locale');
        $minutes = 60 * 24 * 30;

        return response()->json(['locale' => $locale])
            ->cookie($cookieName, $locale, $minutes, '/', null, config('app.env') === 'production', true);
    }
}
