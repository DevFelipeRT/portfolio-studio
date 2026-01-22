<?php

namespace App\Modules\IdentityAccess\Infrastructure\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class IdentityAccessServiceProvider extends ServiceProvider
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

    }

    /**
     * Registers the routes for the module under the auth middleware group.
     */
    private function registerRoutes(): void
    {
        Route::middleware(['web'])
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../Routes/auth.php');
            });

        Route::middleware(['web', 'auth'])
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../Routes/profile.php');
            });

        // Route::middleware('web')
        //     ->group(function (): void {
        //         $this->loadRoutesFrom(__DIR__ . '/../../Routes/public.php');
        //     });
    }
}
