<?php

declare(strict_types=1);

use App\Modules\Skills\Http\Controllers\SkillController;
use App\Modules\Skills\Http\Controllers\SkillCategoryController;
use App\Modules\Skills\Http\Controllers\SkillCategoryTranslationController;
use App\Modules\Skills\Http\Controllers\SkillTranslationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        // Skills CRUD (admin.skills.pages.*)
        Route::resource('skills', SkillController::class)->names('skills');

        // Skill translations (admin.skills.translations.*)
        Route::get('skills/{skill}/translations', [SkillTranslationController::class, 'index'])
            ->name('skills.translations.index');
        Route::post('skills/{skill}/translations', [SkillTranslationController::class, 'store'])
            ->name('skills.translations.store');
        Route::put('skills/{skill}/translations/{locale}', [SkillTranslationController::class, 'update'])
            ->name('skills.translations.update');
        Route::delete('skills/{skill}/translations/{locale}', [SkillTranslationController::class, 'destroy'])
            ->name('skills.translations.destroy');

        // Skill categories CRUD (admin.skill-categories.pages.*)
        Route::resource('skill-categories', SkillCategoryController::class)
            ->except(['index'])
            ->names('skill-categories')
            ->parameters(['skill-categories' => 'skillCategory']);

        // Skill category translations (admin.skill-categories.translations.*)
        Route::get('skill-categories/{skillCategory}/translations', [SkillCategoryTranslationController::class, 'index'])
            ->name('skill-categories.translations.index');
        Route::post('skill-categories/{skillCategory}/translations', [SkillCategoryTranslationController::class, 'store'])
            ->name('skill-categories.translations.store');
        Route::put('skill-categories/{skillCategory}/translations/{locale}', [SkillCategoryTranslationController::class, 'update'])
            ->name('skill-categories.translations.update');
        Route::delete('skill-categories/{skillCategory}/translations/{locale}', [SkillCategoryTranslationController::class, 'destroy'])
            ->name('skill-categories.translations.destroy');
    });
