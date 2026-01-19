<?php

declare(strict_types=1);

use App\Modules\Skills\Http\Controllers\SkillController;
use App\Modules\Skills\Http\Controllers\SkillCategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        // Skills CRUD (admin.skills.pages.*)
        Route::resource('skills', SkillController::class)->names('skills');

        // Skill categories CRUD (admin.skill-categories.pages.*)
        Route::resource('skill-categories', SkillCategoryController::class)
            ->names('skill-categories')
            ->parameters(['skill-categories' => 'skillCategory']);
    });
