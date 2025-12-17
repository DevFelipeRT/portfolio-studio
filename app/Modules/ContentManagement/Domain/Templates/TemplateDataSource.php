<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Templates;

/**
 * Immutable configuration for resolving template data from an external source.
 *
 * This value object describes which external source should be used for a
 * template and how section data fields map to source parameters.
 */
final class TemplateDataSource
{
    public const TYPE_CAPABILITY = 'capability';

    /**
     * @param array<string,string> $parameterMapping
     */
    private function __construct(
        private readonly string $type,
        private readonly string $capabilityKey,
        private readonly array $parameterMapping,
        private readonly string $targetField,
    ) {
    }

    /**
     * Creates a data source configuration for a capability-based template.
     *
     * @param array<string,string> $parameterMapping Map of section data keys to capability parameter names.
     */
    public static function forCapability(
        string $capabilityKey,
        array $parameterMapping = [],
        string $targetField = 'items',
    ): self {
        return new self(
            self::TYPE_CAPABILITY,
            $capabilityKey,
            $parameterMapping,
            $targetField,
        );
    }

    public function type(): string
    {
        return $this->type;
    }

    public function capabilityKey(): string
    {
        return $this->capabilityKey;
    }

    /**
     * @return array<string,string>
     */
    public function parameterMapping(): array
    {
        return $this->parameterMapping;
    }

    public function targetField(): string
    {
        return $this->targetField;
    }

    public function isCapability(): bool
    {
        return $this->type === self::TYPE_CAPABILITY;
    }

    /**
     * Builds the parameter array for the external source based on section data.
     *
     * @param array<string,mixed> $sectionData
     * @return array<string,mixed>
     */
    public function buildParameters(array $sectionData): array
    {
        if ($this->parameterMapping === []) {
            return [];
        }

        $parameters = [];

        foreach ($this->parameterMapping as $dataKey => $parameterName) {
            if (!array_key_exists($dataKey, $sectionData)) {
                continue;
            }

            $parameters[$parameterName] = $sectionData[$dataKey];
        }

        return $parameters;
    }
}
