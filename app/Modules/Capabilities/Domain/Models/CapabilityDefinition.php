<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Models;

use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;

/**
 * Basic capability definition with metadata and parameter schema.
 */
final class CapabilityDefinition implements ICapabilityDefinition
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
    ) {
    }

    public function getKey(): ICapabilityKey
    {
        return $this->key;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @return array<string, mixed>
     */
    public function getParametersSchema(): array
    {
        return $this->parametersSchema;
    }

    public function getReturnTypeDescription(): string
    {
        return $this->returnTypeDescription;
    }

    public function isPublic(): bool
    {
        return $this->public;
    }
}
