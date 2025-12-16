<?php

namespace App\Modules\Initiatives\Infrastructure\Providers;

use App\Modules\Initiatives\Application\Capabilities\Providers\VisibleInitiatives;

use App\Modules\Shared\Support\Capabilities\Traits\RegisterCapabilitiesTrait;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class InitiativesServiceProvider extends ServiceProvider
{
    use RegisterCapabilitiesTrait;

    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->registerBindings();
        $this->registerCapabilitiesIfAvailable([
            VisibleInitiatives::class,
        ]);
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
