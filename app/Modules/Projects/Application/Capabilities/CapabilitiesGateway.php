<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Capabilities;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;

final class CapabilitiesGateway
{
    public function __construct(
        private readonly ICapabilitiesFactory $factory,
        private readonly ICapabilityDataResolver $resolver,
    ) {
    }

    /**
     * @param string $key
     * @param array<string,mixed> $parameters
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
