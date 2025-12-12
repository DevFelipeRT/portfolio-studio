<?php

namespace App\Providers;

use App\Modules\ContentManagement\Infrastructure\Providers\ContentManagementServiceProvider;
use App\Modules\Technologies\Domain\Enums\TechnologyCategories;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(ContentManagementServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'technologyCategories' => fn(): array => TechnologyCategories::options(),
        ]);
    }
}
