<?php

declare(strict_types=1);

use App\Modules\ContactChannels\Http\Controllers\Public\ContactChannelController;
use Illuminate\Support\Facades\Route;

Route::get('contact-channels', [ContactChannelController::class, 'index'])
    ->name('contact-channels.public.index');
