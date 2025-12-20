<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Application\Services;

use App\Modules\Capabilities\Domain\Models\CapabilityDefinition;
use App\Modules\Capabilities\Domain\ValueObjects\CapabilityKey;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;

/**
 * Default factory for creating capability keys and definitions.
 */
final class CapabilitiesFactory implements ICapabilitiesFactory
{
    public function createKey(string $value): ICapabilityKey
    {
        return new CapabilityKey($value);
    }

    /**
     * @param array<string, mixed> $parametersSchema
     */
    public function createPublicDefinition(
        string $key,
        string $description,
        array $parametersSchema,
        string $returnTypeDescription,
    ): ICapabilityDefinition {
        return $this->createDefinition(
            $key,
            $description,
            $parametersSchema,
            $returnTypeDescription,
            true,
        );
    }

    /**
     * @param array<string, mixed> $parametersSchema
     */
    public function createDefinition(
        string $key,
        string $description,
        array $parametersSchema,
        string $returnTypeDescription,
        bool $public,
    ): ICapabilityDefinition {
        return new CapabilityDefinition(
            $this->createKey($key),
            $description,
            $parametersSchema,
            $returnTypeDescription,
            $public,
        );
    }
}
