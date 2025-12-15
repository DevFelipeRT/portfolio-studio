<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Models;

use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;

/**
 * Represents a capability registered in the capabilities domain.
 */
final class RegisteredCapability implements ICapabilityDefinition
{
    /**
     * @param array<string, mixed> $parametersSchema
     */
    public function __construct(
        private readonly ICapabilityKey $key,
        private readonly string $description,
        private readonly array $parametersSchema,
        private readonly string $returnTypeDescription,
        private readonly bool $public,
        private readonly ICapabilityProvider $provider,
    ) {
    }

    /**
     * Creates a new instance from an existing capability definition
     * and a provider implementation.
     */
    public static function fromDefinition(
        ICapabilityDefinition $definition,
        ICapabilityProvider $provider,
    ): self {
        return new self(
            $definition->getKey(),
            $definition->getDescription(),
            $definition->getParametersSchema(),
            $definition->getReturnTypeDescription(),
            $definition->isPublic(),
            $provider,
        );
    }

    /**
     * Returns the capability key.
     */
    public function getKey(): ICapabilityKey
    {
        return $this->key;
    }

    /**
     * Returns a human-readable description of the capability.
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Returns a machine-readable parameter schema definition.
     *
     * @return array<string, mixed>
     */
    public function getParametersSchema(): array
    {
        return $this->parametersSchema;
    }

    /**
     * Returns a description of the expected return payload.
     */
    public function getReturnTypeDescription(): string
    {
        return $this->returnTypeDescription;
    }

    /**
     * Indicates whether this capability is available to public consumers.
     */
    public function isPublic(): bool
    {
        return $this->public;
    }

    /**
     * Returns the provider associated with this capability.
     */
    public function getProvider(): ICapabilityProvider
    {
        return $this->provider;
    }
}
