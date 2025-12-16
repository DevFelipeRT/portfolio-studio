<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Factory facade for creating capability keys and definitions.
 */
interface ICapabilitiesFactory
{
    /**
     * Creates a capability key instance for the given value.
     */
    public function createKey(string $value): ICapabilityKey;

    /**
     * Creates a capability definition for a public capability.
     *
     * @param array<string, mixed> $parametersSchema
     */
    public function createPublicDefinition(
        string $key,
        string $description,
        array $parametersSchema,
        string $returnTypeDescription,
    ): ICapabilityDefinition;

    /**
     * Creates a capability definition with an explicit visibility flag.
     *
     * @param array<string, mixed> $parametersSchema
     */
    public function createDefinition(
        string $key,
        string $description,
        array $parametersSchema,
        string $returnTypeDescription,
        bool $public,
    ): ICapabilityDefinition;
}
