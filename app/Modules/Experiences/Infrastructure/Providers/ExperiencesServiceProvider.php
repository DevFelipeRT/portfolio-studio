<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Infrastructure\Providers;

use App\Modules\Experiences\Application\Capabilities\Providers\VisibleExperiences;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;
use App\Modules\Experiences\Infrastructure\Repositories\ExperienceRepository;
use App\Modules\Experiences\Infrastructure\Repositories\ExperienceTranslationRepository;
use App\Modules\Shared\Support\Capabilities\Traits\RegisterCapabilitiesTrait;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Service provider for the Experiences module.
 */
final class ExperiencesServiceProvider extends ServiceProvider
{
    use RegisterCapabilitiesTrait;

    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->registerBindings();
        $this->registerCapabilitiesIfAvailable([
            VisibleExperiences::class,
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
        $this->app->bind(IExperienceRepository::class, ExperienceRepository::class);
        $this->app->bind(
            IExperienceTranslationRepository::class,
            ExperienceTranslationRepository::class,
        );
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
