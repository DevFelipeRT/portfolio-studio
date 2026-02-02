<?php

namespace App\Modules\Skills\Infrastructure\Providers;

use App\Modules\Skills\Application\Capabilities\Providers\SkillList;
use App\Modules\Skills\Application\Capabilities\Providers\SkillsByCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use App\Modules\Skills\Infrastructure\Repositories\SkillCategoryRepository;
use App\Modules\Skills\Infrastructure\Repositories\SkillCategoryTranslationRepository;
use App\Modules\Skills\Infrastructure\Repositories\SkillRepository;
use App\Modules\Skills\Infrastructure\Repositories\SkillTranslationRepository;

use App\Modules\Shared\Support\Capabilities\Traits\RegisterCapabilitiesTrait;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class SkillsServiceProvider extends ServiceProvider
{
    use RegisterCapabilitiesTrait;

    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->registerBindings();
        $this->registerCapabilitiesIfAvailable([
            SkillList::class,
            SkillsByCategory::class,
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
        $this->app->bind(ISkillRepository::class, SkillRepository::class);
        $this->app->bind(ISkillCategoryRepository::class, SkillCategoryRepository::class);
        $this->app->bind(ISkillTranslationRepository::class, SkillTranslationRepository::class);
        $this->app->bind(ISkillCategoryTranslationRepository::class, SkillCategoryTranslationRepository::class);
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
