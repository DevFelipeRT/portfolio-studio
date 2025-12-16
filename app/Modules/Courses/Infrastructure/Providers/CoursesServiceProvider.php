<?php

namespace App\Modules\Courses\Infrastructure\Providers;

use App\Modules\Courses\Application\Capabilities\Providers\VisibleCourses;
use App\Modules\Courses\Application\Services\CourseService;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class CoursesServiceProvider extends ServiceProvider
{
    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->registerBindings();
        $this->registerCapabilitiesIfAvailable();
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

    private function registerCapabilitiesIfAvailable(): void
    {
        if (!$this->app->bound(ICapabilityCatalog::class)) {
            return;
        }

        /** @var ICapabilityCatalog $catalog */
        $catalog = $this->app->make(ICapabilityCatalog::class);

        $this->registerCapabilities($catalog);
    }

    private function registerCapabilities(ICapabilityCatalog $catalog): void
    {
        /** @var CourseService $courseService */
        $courseService = $this->app->make(CourseService::class);

        /** @var ICapabilitiesFactory $capabilitiesFactory */
        $capabilitiesFactory = $this->app->make(ICapabilitiesFactory::class);

        $visibleCourses = new VisibleCourses(
            $courseService,
            $capabilitiesFactory,
        );

        $catalog->register(
            $visibleCourses->getDefinition(),
            $visibleCourses,
        );
    }
}
