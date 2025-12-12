<?php

declare(strict_types=1);

use App\Modules\Experiences\Http\Controllers\ExperienceController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Experiences management.
         */
        Route::resource('experiences', ExperienceController::class)->names('experiences');
    });
