<?php

declare(strict_types=1);

use App\Modules\WebsiteSettings\Http\Controllers\Admin\WebsiteSettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        Route::get('website-settings', [WebsiteSettingsController::class, 'edit'])
            ->name('website-settings.edit');

        Route::put('website-settings', [WebsiteSettingsController::class, 'update'])
            ->name('website-settings.update');
    });
