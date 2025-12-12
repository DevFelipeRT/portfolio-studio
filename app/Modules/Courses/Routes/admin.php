<?php

declare(strict_types=1);

use App\Modules\Technologies\Http\Controllers\TechnologyController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        // Technologies CRUD (admin.technologies.pages.*)
        Route::resource('technologies', TechnologyController::class)->names('technologies');
    });
