<?php

use App\Modules\Home\HomeController;
use App\Modules\Locale\Http\Controllers\LocaleController;
use App\Modules\Mail\Http\Controllers\MessageController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Public endpoint (landing page).
 */
Route::get('/', [HomeController::class, 'index'])->name('home');

/**
 * Public locale endpoint.
 */
Route::post('/set-locale', [LocaleController::class, 'set']);

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
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

require __DIR__ . '/auth.php';
