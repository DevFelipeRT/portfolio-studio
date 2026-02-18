<?php

declare(strict_types=1);

use App\Modules\Initiatives\Http\Controllers\InitiativeController;
use App\Modules\Initiatives\Http\Controllers\InitiativeTranslationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Initiatives management.
         */
        Route::resource('initiatives', InitiativeController::class)
            ->except(['show'])
            ->names('initiatives');

        /**
         * Initiative translations management.
         */
        Route::get('initiatives/{initiative}/translations', [InitiativeTranslationController::class, 'index'])
            ->name('initiatives.translations.index');
        Route::post('initiatives/{initiative}/translations', [InitiativeTranslationController::class, 'store'])
            ->name('initiatives.translations.store');
        Route::put('initiatives/{initiative}/translations/{locale}', [InitiativeTranslationController::class, 'update'])
            ->name('initiatives.translations.update');
        Route::delete('initiatives/{initiative}/translations/{locale}', [InitiativeTranslationController::class, 'destroy'])
            ->name('initiatives.translations.destroy');

        Route::patch(
            'initiatives/{initiative}/toggle-display',
            [InitiativeController::class, 'toggleDisplay']
        )->name('initiatives.toggle-display');
    });
