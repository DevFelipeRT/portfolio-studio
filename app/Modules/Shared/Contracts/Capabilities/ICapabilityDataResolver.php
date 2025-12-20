<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Contract for resolving data from registered capabilities.
 */
interface ICapabilityDataResolver
{
    /**
     * Resolves data for a single capability request.
     *
     * @param array<string, mixed> $parameters
     */
    public function resolve(
        ICapabilityKey $key,
        array $parameters = [],
        ?ICapabilityContext $context = null,
    ): mixed;

    /**
     * Resolves data for multiple capability requests.
     *
     * Each request entry must contain:
     *  - key: ICapabilityKey
     *  - parameters: array<string, mixed>
     *
     * @param array<int, array{key: ICapabilityKey, parameters: array<string, mixed>}> $requests
     * @return array<int, mixed>
     */
    public function resolveMany(
        array $requests,
        ?ICapabilityContext $context = null,
    ): array;
}
