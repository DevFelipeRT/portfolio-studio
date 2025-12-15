<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Infrastructure\Providers;

use App\Modules\Capabilities\Application\Services\CapabilityCatalogService;
use App\Modules\Capabilities\Domain\Services\CapabilityParameterValidator;
use App\Modules\Capabilities\Domain\Services\CapabilityRegistry;
use App\Modules\Capabilities\Domain\Services\CapabilityResolver;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the capabilities module services in the application container.
 */
final class CapabilitiesServiceProvider extends ServiceProvider
{
    /**
     * Registers bindings in the container.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../Config/capabilities.php',
            'capabilities',
        );

        $this->app->singleton(CapabilityRegistry::class);

        $this->app->singleton(CapabilityParameterValidator::class, function () {
            $validation = $this->app['config']->get('capabilities.validation', []);

            $strictTypes = (bool) ($validation['strict_types'] ?? true);
            $allowUnknownParameters = (bool) ($validation['allow_unknown_parameters'] ?? true);

            return new CapabilityParameterValidator(
                $strictTypes,
                $allowUnknownParameters,
            );
        });

        $this->app->singleton(ICapabilityCatalog::class, function () {
            return new CapabilityCatalogService(
                $this->app->make(CapabilityRegistry::class),
            );
        });

        $this->app->singleton(ICapabilityDataResolver::class, function () {
            return new CapabilityResolver(
                $this->app->make(ICapabilityCatalog::class),
                $this->app->make(CapabilityParameterValidator::class),
            );
        });
    }

    /**
     * Boots the capabilities module.
     */
    public function boot(): void
    {
    }
}
