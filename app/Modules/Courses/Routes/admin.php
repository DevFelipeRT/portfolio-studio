<?php

declare(strict_types=1);

use App\Modules\Courses\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        // Courses CRUD (admin.courses.pages.*)
        Route::resource('courses', CourseController::class)->names('courses');
    });
