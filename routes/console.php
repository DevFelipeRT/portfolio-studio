<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('images:prune-orphans --disk=public --path=images --min-age-minutes=1440')
    ->dailyAt('00:00')
    ->timezone('UTC')
    ->withoutOverlapping();