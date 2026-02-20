<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use App\Modules\Shared\Support\RichText\Exceptions\RichTextValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Modules\SystemLocale\Http\Middleware\ResolveSystemLocale::class,
            \App\Modules\Inertia\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->map(
            RichTextValidationException::class,
            static fn (RichTextValidationException $exception): ValidationException => ValidationException::withMessages([
                $exception->field() => [$exception->getMessage()],
            ]),
        );
    })->create();
