<?php

declare(strict_types=1);

use App\Modules\ContactChannels\Http\Controllers\Admin\ContactChannelController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        Route::get('contact-channels', [ContactChannelController::class, 'index'])
            ->name('contact-channels.index');

        Route::get('contact-channels/create', [ContactChannelController::class, 'create'])
            ->name('contact-channels.create');

        Route::get('contact-channels/{contactChannel}/edit', [ContactChannelController::class, 'edit'])
            ->name('contact-channels.edit');

        Route::post('contact-channels', [ContactChannelController::class, 'store'])
            ->name('contact-channels.store');

        Route::put('contact-channels/{contactChannel}', [ContactChannelController::class, 'update'])
            ->name('contact-channels.update');

        Route::delete('contact-channels/{contactChannel}', [ContactChannelController::class, 'destroy'])
            ->name('contact-channels.destroy');

        Route::post('contact-channels/reorder', [ContactChannelController::class, 'reorder'])
            ->name('contact-channels.reorder');

        Route::post('contact-channels/{contactChannel}/toggle-active', [ContactChannelController::class, 'toggleActive'])
            ->name('contact-channels.toggle-active');
    });
