<?php

declare(strict_types=1);

use App\Modules\Projects\Http\Controllers\ProjectController;
use App\Modules\Projects\Http\Controllers\ProjectImageController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Projects management.
         */
        Route::resource('projects', ProjectController::class)->names('projects');

        /**
         * Project images management.
         */
        Route::resource('projects.images', ProjectImageController::class)
            ->only(['store', 'update', 'destroy'])
            ->names('projects.images');
    });
