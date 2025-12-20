<?php

declare(strict_types=1);

use App\Modules\Initiatives\Http\Controllers\InitiativeController;
use App\Modules\Initiatives\Http\Controllers\InitiativeImageController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Initiatives management.
         */
        Route::resource('initiatives', InitiativeController::class)->names('initiatives');

        /**
         * Initiative images management.
         */
        Route::resource('initiatives.images', InitiativeImageController::class)
            ->only(['store', 'update', 'destroy'])
            ->names('initiatives.images');

        Route::put(
            'initiatives/{initiative}/toggle-display',
            [InitiativeController::class, 'toggleDisplay']
        )->name('initiatives.toggleDisplay');
    });
