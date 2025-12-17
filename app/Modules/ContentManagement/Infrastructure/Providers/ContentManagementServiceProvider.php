<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Infrastructure\Providers;

use App\Modules\ContentManagement\Application\Capabilities\SectionCapabilitiesDataFetcher;
use App\Modules\ContentManagement\Application\Capabilities\CapabilitiesGateway;
use App\Modules\ContentManagement\Domain\Repositories\IPageRepository;
use App\Modules\ContentManagement\Domain\Repositories\IPageSectionRepository;
use App\Modules\ContentManagement\Domain\Templates\TemplateRegistry;
use App\Modules\ContentManagement\Infrastructure\Repositories\PageRepository;
use App\Modules\ContentManagement\Infrastructure\Repositories\PageSectionRepository;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Service provider responsible for wiring the ContentManagement module
 * into the Laravel application.
 *
 * This provider registers route files, configuration and container bindings
 * required by the module.
 */
final class ContentManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->registerConfig();
        $this->registerBindings();
    }

    public function boot(): void
    {
        $this->registerRoutes();
    }

    /**
     * Registers interface to implementation bindings for the module.
     */
    private function registerBindings(): void
    {
        $this->app->bind(IPageRepository::class, PageRepository::class);
        $this->app->bind(IPageSectionRepository::class, PageSectionRepository::class);

        $this->app->singleton(TemplateRegistry::class, static function ($app): TemplateRegistry {
            $config = $app['config']->get('content_management.templates', []);

            if (!is_array($config)) {
                $config = [];
            }

            return TemplateRegistry::fromConfigArray($config);
        });

        $this->app->singleton(CapabilitiesGateway::class, static function ($app): CapabilitiesGateway {
            return new CapabilitiesGateway(
                $app->make(ICapabilitiesFactory::class),
                $app->make(ICapabilityDataResolver::class),
            );
        });

        $this->app->singleton(SectionCapabilitiesDataFetcher::class, static function ($app): SectionCapabilitiesDataFetcher {
            return new SectionCapabilitiesDataFetcher(
                $app->make(CapabilitiesGateway::class),
            );
        });
    }

    /**
     * Registers configuration files for the module.
     *
     * The content_management.php file is expected to hold general
     * settings for the module, including template configuration.
     */
    private function registerConfig(): void
    {
        $configPath = __DIR__ . '/../../Config/content_management.php';

        if (file_exists($configPath)) {
            $this->mergeConfigFrom($configPath, 'content_management');
        }
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

        Route::middleware('web')
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../Routes/public.php');
            });
    }
}
