<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\Capabilities\Traits;

use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;

/**
 * Shared helper for registering capability providers in module service providers.
 *
 * @property \Illuminate\Contracts\Foundation\Application $app
 */
trait RegisterCapabilitiesTrait
{
    /**
     * Registers the given capability providers when the catalog is available.
     *
     * @param array<int, class-string<ICapabilityProvider>> $providerClasses
     */
    protected function registerCapabilitiesIfAvailable(array $providerClasses): void
    {
        if (!$this->app->bound(ICapabilityCatalog::class)) {
            return;
        }

        /** @var ICapabilityCatalog $catalog */
        $catalog = $this->app->make(ICapabilityCatalog::class);

        foreach ($providerClasses as $providerClass) {
            $this->registerCapability($catalog, $providerClass);
        }
    }

    /**
     * Resolves and registers a single capability provider from the container.
     *
     * @param class-string<ICapabilityProvider> $providerClass
     */
    protected function registerCapability(
        ICapabilityCatalog $catalog,
        string $providerClass,
    ): void {
        /** @var ICapabilityProvider $provider */
        $provider = $this->app->make($providerClass);

        $catalog->register(
            $provider->getDefinition(),
            $provider,
        );
    }
}
