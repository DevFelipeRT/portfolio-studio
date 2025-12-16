<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\Capabilities\Traits;

use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Contracts\Foundation\Application;
use InvalidArgumentException;
use LogicException;

/**
 * Shared helper for registering capability providers in module service providers.
 *
 * @property Application $app
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
        if (!\property_exists($this, 'app')) {
            throw new LogicException(
                'RegisterCapabilitiesTrait requires an $app property on the using class.'
            );
        }

        if (!$this->app instanceof Application) {
            throw new LogicException(
                'RegisterCapabilitiesTrait requires $this->app to be an instance of the Laravel application container.'
            );
        }

        if ($providerClasses === []) {
            return;
        }

        if (!$this->app->bound(ICapabilityCatalog::class)) {
            return;
        }

        $catalog = $this->app->make(ICapabilityCatalog::class);

        if (!$catalog instanceof ICapabilityCatalog) {
            throw new LogicException(
                'Resolved capability catalog does not implement ICapabilityCatalog.'
            );
        }

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
        if ($providerClass === '') {
            throw new InvalidArgumentException(
                'Capability provider class name must not be empty.'
            );
        }

        if (!\is_subclass_of($providerClass, ICapabilityProvider::class)) {
            throw new InvalidArgumentException(
                \sprintf(
                    'Capability provider class "%s" must implement %s.',
                    $providerClass,
                    ICapabilityProvider::class,
                )
            );
        }

        /** @var ICapabilityProvider $provider */
        $provider = $this->app->make($providerClass);

        if (!$provider instanceof ICapabilityProvider) {
            throw new LogicException(
                \sprintf(
                    'Resolved provider for class "%s" does not implement %s.',
                    $providerClass,
                    ICapabilityProvider::class,
                )
            );
        }

        $catalog->register(
            $provider->getDefinition(),
            $provider,
        );
    }
}
