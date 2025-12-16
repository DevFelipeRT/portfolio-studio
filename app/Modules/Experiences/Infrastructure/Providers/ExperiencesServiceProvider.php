<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Infrastructure\Providers;

use App\Modules\Experiences\Application\Capabilities\Providers\VisibleExperiences;
use App\Modules\Experiences\Application\Services\ExperienceService;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Service provider for the Experiences module.
 */
final class ExperiencesServiceProvider extends ServiceProvider
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
        $this->registerCapabilitiesIfAvailable();
    }

    /**
     * Registers interface to implementation bindings for the module.
     */
    private function registerBindings(): void
    {
        // No explicit bindings required for this module at the moment.
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

    /**
     * Attempts to register capabilities in the central catalog if it is bound.
     */
    private function registerCapabilitiesIfAvailable(): void
    {
        if (!$this->app->bound(ICapabilityCatalog::class)) {
            return;
        }

        /** @var ICapabilityCatalog $catalog */
        $catalog = $this->app->make(ICapabilityCatalog::class);

        $this->registerCapabilities($catalog);
    }

    /**
     * Registers this module's capabilities in the central capability catalog.
     */
    private function registerCapabilities(ICapabilityCatalog $catalog): void
    {
        /** @var ExperienceService $experienceService */
        $experienceService = $this->app->make(ExperienceService::class);

        /** @var ICapabilitiesFactory $capabilitiesFactory */
        $capabilitiesFactory = $this->app->make(ICapabilitiesFactory::class);

        $visibleExperiences = new VisibleExperiences(
            $experienceService,
            $capabilitiesFactory,
        );

        $catalog->register(
            $visibleExperiences->getDefinition(),
            $visibleExperiences,
        );
    }
}
