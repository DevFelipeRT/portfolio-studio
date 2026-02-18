<?php

declare(strict_types=1);

use App\Modules\Mail\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')
    ->group(static function (): void {
        /**
         * Messages management.
         */
        Route::resource('messages', MessageController::class)
            ->only(['index', 'destroy'])
            ->names('messages');

        Route::patch('/messages/{message}/important', [MessageController::class, 'markAsImportant'])
            ->name('messages.mark-as-important');

        Route::patch('/messages/{message}/not-important', [MessageController::class, 'markAsNotImportant'])
            ->name('messages.mark-as-not-important');

        Route::patch('/messages/{message}/seen', [MessageController::class, 'markAsSeen'])
            ->name('messages.mark-as-seen');

        Route::patch('/messages/{message}/unseen', [MessageController::class, 'markAsUnseen'])
            ->name('messages.mark-as-unseen');
    });
