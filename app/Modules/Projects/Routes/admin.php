<?php

declare(strict_types=1);

use App\Modules\Projects\Http\Controllers\ProjectController;
use App\Modules\Projects\Http\Controllers\ProjectImageController;
use App\Modules\Projects\Http\Controllers\ProjectTranslationController;
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

        /**
         * Project translations management.
         */
        Route::get('projects/{project}/translations', [ProjectTranslationController::class, 'index'])
            ->name('projects.translations.index');
        Route::post('projects/{project}/translations', [ProjectTranslationController::class, 'store'])
            ->name('projects.translations.store');
        Route::put('projects/{project}/translations/{locale}', [ProjectTranslationController::class, 'update'])
            ->name('projects.translations.update');
        Route::delete('projects/{project}/translations/{locale}', [ProjectTranslationController::class, 'destroy'])
            ->name('projects.translations.destroy');
    });
