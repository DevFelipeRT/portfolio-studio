<?php

use App\Modules\SystemLocale\Http\Controllers\SystemLocaleController;
use App\Modules\WebsiteSettings\Http\Controllers\PublicLocaleController;
use App\Modules\Mail\Http\Controllers\MessageController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Public website locale endpoint.
 */
Route::post('/set-locale', [PublicLocaleController::class, 'set']);

/**
 * System locale endpoint (authenticated).
 */
Route::middleware(['auth'])->group(function () {
    Route::post('/system/locale', [SystemLocaleController::class, 'set']);
});

/**
 * Public contact form endpoint (landing page).
 */
Route::post('/contact/messages', [MessageController::class, 'store'])
    ->name('messages.store');

/**
 * Protected admin dashboard endpoint.
 */
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard/admin/Dashboard');
    })->name('dashboard');
});
