<?php

namespace App\Modules\Technologies\Infrastructure\Providers;

use App\Modules\Technologies\Domain\Enums\TechnologyCategories;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class TechnologiesServiceProvider extends ServiceProvider
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

        Inertia::share([
            'technologyCategories' => fn(): array => TechnologyCategories::options(),
        ]);
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
