<?php

namespace App\Providers;

use App\Modules\Capabilities\Infrastructure\Providers\CapabilitiesServiceProvider;
use App\Modules\ContentManagement\Infrastructure\Providers\ContentManagementServiceProvider;
use App\Modules\Courses\Infrastructure\Providers\CoursesServiceProvider;
use App\Modules\Experiences\Infrastructure\Providers\ExperiencesServiceProvider;
use App\Modules\IdentityAccess\Infrastructure\Providers\IdentityAccessServiceProvider;
use App\Modules\Images\Infrastructure\Providers\ImagesServiceProvider;
use App\Modules\Initiatives\Infrastructure\Providers\InitiativesServiceProvider;
use App\Modules\Mail\Infrastructure\Providers\MailServiceProvider;
use App\Modules\Projects\Infrastructure\Providers\ProjectsServiceProvider;
use App\Modules\Skills\Infrastructure\Providers\SkillsServiceProvider;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(CapabilitiesServiceProvider::class);

        $this->app->register(ContentManagementServiceProvider::class);

        $this->app->register(CoursesServiceProvider::class);

        $this->app->register(ExperiencesServiceProvider::class);

        $this->app->register(IdentityAccessServiceProvider::class);

        $this->app->register(ImagesServiceProvider::class);

        $this->app->register(InitiativesServiceProvider::class);

        $this->app->register(MailServiceProvider::class);

        $this->app->register(ProjectsServiceProvider::class);

        $this->app->register(SkillsServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::enforceMorphMap(
            config('image_owners.morph_map', [])
        );

        Vite::prefetch(concurrency: 3);

    }
}
