<?php

declare(strict_types=1);

use App\Modules\WebsiteSettings\Http\Controllers\Public\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('robots.txt', [SeoController::class, 'robots'])
    ->name('website-settings.robots');

Route::get('sitemap.xml', [SeoController::class, 'sitemap'])
    ->name('website-settings.sitemap');
