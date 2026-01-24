<?php

declare(strict_types=1);

use App\Modules\ContentManagement\Http\Controllers\Admin\LocalesController;
use App\Modules\ContentManagement\Http\Controllers\Admin\PageController;
use App\Modules\ContentManagement\Http\Controllers\Admin\PageSectionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/content')
    ->as('admin.content.')
    ->group(static function (): void {
        // Pages CRUD (admin.content.pages.*)
        Route::resource('pages', PageController::class)->except(['show']);

        // Home page setter
        Route::post('pages/{page}/set-home', [PageController::class, 'setHome'])
            ->name('pages.set-home');

        // Locales
        Route::get('locales', [LocalesController::class, 'index'])
            ->name('locales.index');

        // Sections CRUD and auxiliary operations (admin.content.sections.*)
        Route::post('sections', [PageSectionController::class, 'store'])
            ->name('sections.store');

        Route::put('sections/{section}', [PageSectionController::class, 'update'])
            ->name('sections.update');

        Route::delete('sections/{section}', [PageSectionController::class, 'destroy'])
            ->name('sections.destroy');

        Route::post('sections/{section}/toggle-active', [PageSectionController::class, 'toggleActive'])
            ->name('sections.toggle-active');

        Route::post('sections/reorder', [PageSectionController::class, 'reorder'])
            ->name('sections.reorder');
    });
