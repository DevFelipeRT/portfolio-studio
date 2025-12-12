<?php

declare(strict_types=1);

use App\Modules\ContentManagement\Http\Controllers\Public\PageRenderController;
use Illuminate\Support\Facades\Route;

Route::prefix('content')
    ->as('content.')
    ->group(static function (): void {
        Route::get('{slug}', [PageRenderController::class, 'show'])
            ->name('pages.show');
    });
