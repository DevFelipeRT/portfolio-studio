<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Capabilities;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;

/**
 * Gateway between ContentManagement and the global capabilities subsystem.
 *
 * Adapts string capability keys to ICapabilityKey instances and delegates
 * execution to the shared capability data resolver.
 */
class CapabilitiesGateway
{
    public function __construct(
        private readonly ICapabilitiesFactory $factory,
        private readonly ICapabilityDataResolver $resolver,
    ) {
    }

    /**
     * Resolves a single capability identified by its string key.
     *
     * @param string $key Capability key (for example "projects.visible.v1").
     * @param array<string,mixed> $parameters Input parameters for the capability.
     */
    public function resolve(
        string $key,
        array $parameters = [],
        ?ICapabilityContext $context = null,
    ): mixed {
        $capabilityKey = $this->factory->createKey($key);

        return $this->resolver->resolve($capabilityKey, $parameters, $context);
    }

    /**
     * Resolves multiple capabilities in a single batch call.
     *
     * Each request entry must contain:
     *  - key: string capability key.
     *  - parameters: array of input parameters.
     *
     * @param array<int,array{key:string,parameters:array<string,mixed>}> $requests
     * @return array<int,mixed>
     */
    public function resolveMany(
        array $requests,
        ?ICapabilityContext $context = null,
    ): array {
        if ($requests === []) {
            return [];
        }

        $normalizedRequests = [];

        foreach ($requests as $request) {
            $capabilityKey = $this->factory->createKey($request['key']);

            $normalizedRequests[] = [
                'key' => $capabilityKey,
                'parameters' => $request['parameters'] ?? [],
            ];
        }

        return $this->resolver->resolveMany($normalizedRequests, $context);
    }
}
