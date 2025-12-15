<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Describes a capability and its metadata.
 */
interface ICapabilityDefinition
{
    /**
     * Returns the capability key.
     */
    public function getKey(): ICapabilityKey;

    /**
     * Returns a human-readable description of the capability.
     */
    public function getDescription(): string;

    /**
     * Returns a machine-readable parameter schema definition.
     *
     * @return array<string, mixed>
     */
    public function getParametersSchema(): array;

    /**
     * Returns a description of the expected return payload.
     */
    public function getReturnTypeDescription(): string;

    /**
     * Indicates whether this capability is available to public consumers.
     */
    public function isPublic(): bool;
}
