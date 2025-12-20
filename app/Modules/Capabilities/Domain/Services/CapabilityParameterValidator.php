<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Services;

use App\Modules\Capabilities\Domain\Exceptions\CapabilityValidationException;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;

/**
 * Validates and normalizes parameters for capability execution.
 */
final class CapabilityParameterValidator
{
    public function __construct(
        private readonly bool $strictTypeChecking = true,
        private readonly bool $allowUnknownParameters = true,
    ) {
    }

    /**
     * Validates and normalizes parameters for the given capability definition.
     *
     * The schema is expected to be an associative array keyed by parameter name,
     * where each entry may define keys such as "required", "type" and "default".
     *
     * @param array<string, mixed> $parameters
     * @return array<string, mixed>
     */
    public function validateAndNormalize(
        ICapabilityDefinition $definition,
        array $parameters,
    ): array {
        $schema = $definition->getParametersSchema();
        $normalized = [];

        foreach ($schema as $name => $rules) {
            if (!\is_array($rules)) {
                throw new CapabilityValidationException(
                    \sprintf('Invalid parameter schema for "%s".', $name)
                );
            }

            $isRequired = (bool) ($rules['required'] ?? false);
            $expectedType = $rules['type'] ?? null;
            $hasDefault = \array_key_exists('default', $rules);
            $defaultValue = $rules['default'] ?? null;

            $hasProvided = \array_key_exists($name, $parameters);

            if (!$hasProvided && $isRequired && !$hasDefault) {
                throw new CapabilityValidationException(
                    \sprintf('Missing required parameter "%s".', $name)
                );
            }

            $value = $hasProvided ? $parameters[$name] : $defaultValue;

            if ($this->strictTypeChecking && $expectedType !== null && $value !== null) {
                $this->assertType($name, $value, (string) $expectedType);
            }

            $normalized[$name] = $value;
        }

        foreach ($parameters as $name => $value) {
            if (!\array_key_exists($name, $schema)) {
                if (!$this->allowUnknownParameters) {
                    throw new CapabilityValidationException(
                        \sprintf('Unknown parameter "%s" for capability "%s".', $name, $definition->getKey()->value())
                    );
                }

                $normalized[$name] = $value;
            }
        }

        return $normalized;
    }

    /**
     * Asserts that a given value matches the expected primitive type.
     *
     * @param mixed $value
     */
    private function assertType(string $name, mixed $value, string $expectedType): void
    {
        $isValid = match ($expectedType) {
            'string' => \is_string($value),
            'int', 'integer' => \is_int($value),
            'float', 'double' => \is_float($value),
            'bool', 'boolean' => \is_bool($value),
            'array' => \is_array($value),
            default => true,
        };

        if (!$isValid) {
            throw new CapabilityValidationException(
                \sprintf(
                    'Invalid type for parameter "%s". Expected %s.',
                    $name,
                    $expectedType
                )
            );
        }
    }
}
