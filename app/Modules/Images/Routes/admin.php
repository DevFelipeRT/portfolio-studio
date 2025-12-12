<?php

declare(strict_types=1);

use App\Modules\Images\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Images management.
         */
        Route::resource('images', ImageController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
            ->names('images');

        Route::delete('images/bulk-destroy', [ImageController::class, 'bulkDestroy'])
            ->name('images.bulk-destroy');
    });
