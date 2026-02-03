<?php

declare(strict_types=1);

use App\Modules\Experiences\Http\Controllers\ExperienceController;
use App\Modules\Experiences\Http\Controllers\ExperienceTranslationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Experiences management.
         */
        Route::resource('experiences', ExperienceController::class)->names('experiences');

        // Experience translations (admin.experiences.translations.*)
        Route::get('experiences/{experience}/translations', [ExperienceTranslationController::class, 'index'])
            ->name('experiences.translations.index');
        Route::post('experiences/{experience}/translations', [ExperienceTranslationController::class, 'store'])
            ->name('experiences.translations.store');
        Route::put('experiences/{experience}/translations/{locale}', [ExperienceTranslationController::class, 'update'])
            ->name('experiences.translations.update');
        Route::delete('experiences/{experience}/translations/{locale}', [ExperienceTranslationController::class, 'destroy'])
            ->name('experiences.translations.destroy');
    });
