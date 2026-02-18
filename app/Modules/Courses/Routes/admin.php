<?php

declare(strict_types=1);

use App\Modules\Courses\Http\Controllers\CourseController;
use App\Modules\Courses\Http\Controllers\CourseTranslationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        // Courses CRUD (admin.courses.pages.*)
        Route::resource('courses', CourseController::class)
            ->except(['show'])
            ->names('courses');

        // Course translations (admin.courses.translations.*)
        Route::get('courses/{course}/translations', [CourseTranslationController::class, 'index'])
            ->name('courses.translations.index');
        Route::post('courses/{course}/translations', [CourseTranslationController::class, 'store'])
            ->name('courses.translations.store');
        Route::put('courses/{course}/translations/{locale}', [CourseTranslationController::class, 'update'])
            ->name('courses.translations.update');
        Route::delete('courses/{course}/translations/{locale}', [CourseTranslationController::class, 'destroy'])
            ->name('courses.translations.destroy');
    });
