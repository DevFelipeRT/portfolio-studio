<?php

namespace App\Modules\Mail\Infrastructure\Providers;

use App\Modules\Mail\Domain\Repositories\IMessageRepository;
use App\Modules\Mail\Infrastructure\Repositories\MessageRepository;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class MailServiceProvider extends ServiceProvider
{
    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->registerBindings();
    }

    /**
     * Bootstrap any services.
     */
    public function boot(): void
    {
        $this->registerRoutes();
    }

    /**
     * Registers interface to implementation bindings for the module.
     */
    private function registerBindings(): void
    {
        $this->app->bind(IMessageRepository::class, MessageRepository::class);
    }

    /**
     * Registers the admin and public routes for the module under the web middleware group.
     */
    private function registerRoutes(): void
    {
        Route::middleware(['web', 'auth', 'verified'])
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../Routes/admin.php');
            });

        // Route::middleware('web')
        //     ->group(function (): void {
        //         $this->loadRoutesFrom(__DIR__ . '/../../Routes/public.php');
        //     });
    }
}
