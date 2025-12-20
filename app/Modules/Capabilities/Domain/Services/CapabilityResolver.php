<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Services;

use App\Modules\Capabilities\Domain\Exceptions\CapabilityExecutionException;
use App\Modules\Capabilities\Domain\Exceptions\CapabilityNotFoundException;
use App\Modules\Capabilities\Domain\Exceptions\CapabilityValidationException;
use App\Modules\Capabilities\Domain\Models\RegisteredCapability;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityCatalog;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;
use Throwable;

/**
 * Resolves data for capability requests using the registered catalog.
 */
final class CapabilityResolver implements ICapabilityDataResolver
{
    public function __construct(
        private readonly ICapabilityCatalog $catalog,
        private readonly CapabilityParameterValidator $parameterValidator,
    ) {
    }

    /**
     * @param array<string, mixed> $parameters
     */
    public function resolve(
        ICapabilityKey $key,
        array $parameters = [],
        ?ICapabilityContext $context = null,
    ): mixed {
        $capability = $this->getRegisteredCapabilityOrFail($key);

        $normalizedParameters = $this->parameterValidator->validateAndNormalize(
            $capability,
            $parameters
        );

        try {
            return $capability->getProvider()->execute(
                $normalizedParameters,
                $context,
            );
        } catch (CapabilityValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new CapabilityExecutionException(
                \sprintf('Error executing capability "%s".', $key->value()),
                $exception,
            );
        }
    }

    /**
     * @param array<int, array{key: ICapabilityKey, parameters: array<string, mixed>}> $requests
     * @return array<int, mixed>
     */
    public function resolveMany(
        array $requests,
        ?ICapabilityContext $context = null,
    ): array {
        $results = [];

        foreach ($requests as $index => $request) {
            $key = $request['key'];
            $parameters = $request['parameters'];

            $results[$index] = $this->resolve($key, $parameters, $context);
        }

        return $results;
    }

    /**
     * Returns a registered capability for the given key or throws when not found.
     */
    private function getRegisteredCapabilityOrFail(ICapabilityKey $key): RegisteredCapability
    {
        $definition = $this->catalog->getDefinition($key);
        $provider = $this->catalog->getProvider($key);

        if ($definition === null || $provider === null) {
            throw new CapabilityNotFoundException($key);
        }

        if (!$definition instanceof RegisteredCapability) {
            return new RegisteredCapability(
                $definition->getKey(),
                $definition->getDescription(),
                $definition->getParametersSchema(),
                $definition->getReturnTypeDescription(),
                $definition->isPublic(),
                $provider,
            );
        }

        return $definition;
    }
}
