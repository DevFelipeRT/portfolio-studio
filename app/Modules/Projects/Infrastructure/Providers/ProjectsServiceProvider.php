<?php

namespace App\Modules\Projects\Infrastructure\Providers;

use App\Modules\Projects\Application\Capabilities\CapabilitiesGateway;
use App\Modules\Projects\Application\Capabilities\Providers\VisibleProjects;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;
use App\Modules\Shared\Support\Capabilities\Traits\RegisterCapabilitiesTrait;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class ProjectsServiceProvider extends ServiceProvider
{
    use RegisterCapabilitiesTrait;

    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->registerBindings();
        $this->registerCapabilitiesIfAvailable([
            VisibleProjects::class,
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
        $this->app->singleton(CapabilitiesGateway::class, static function ($app): CapabilitiesGateway {
            return new CapabilitiesGateway(
                $app->make(ICapabilitiesFactory::class),
                $app->make(ICapabilityDataResolver::class),
            );
        });
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
