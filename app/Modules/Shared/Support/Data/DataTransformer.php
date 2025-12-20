<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\Data;

use InvalidArgumentException;
use JsonException;
use JsonSerializable;
use Traversable;

/**
 * Immutable transformation pipeline for arbitrary data.
 *
 * Allows chained operations such as converting to arrays and JSON strings,
 * and applying recursive key case conversions across nested structures.
 */
final class DataTransformer
{
    /**
     * Creates a new transformation pipeline for the given value.
     */
    public static function transform(mixed $value): self
    {
        return new self($value);
    }

    /**
     * @param mixed $value Initial value to be transformed.
     */
    public function __construct(
        private mixed $value,
    ) {
    }

    /**
     * Returns the current transformed result.
     */
    public function result(): mixed
    {
        return $this->value;
    }

    /**
     * Converts the current value into an array representation.
     *
     * Objects and nested structures are converted using the following precedence:
     * 1) toArray method when available.
     * 2) JsonSerializable::jsonSerialize.
     * 3) Traversable converted via iterator_to_array.
     * 4) Public properties via get_object_vars.
     *
     * Scalars are wrapped in a single-element array and null becomes an empty array.
     * Nested objects and Traversable values are converted recursively.
     */
    public function toArray(): self
    {
        $clone = clone $this;
        $clone->value = $clone->convertToArray($clone->value);

        return $clone;
    }

    /**
     * Recursively converts all array keys to snake_case.
     *
     * Non-array values are first normalized to an array representation
     * using the same rules as convertToArray, then processed recursively.
     */
    public function toSnakeCase(): self
    {
        $clone = clone $this;

        $normalized = is_array($clone->value)
            ? $clone->value
            : $clone->convertToArray($clone->value);

        $clone->value = $clone->convertKeysRecursive(
            $normalized,
            static function (string $key): string {
                return self::toSnakeCaseKey($key);
            }
        );

        return $clone;
    }

    /**
     * Recursively converts all array keys to camelCase.
     *
     * Non-array values are first normalized to an array representation
     * using the same rules as convertToArray, then processed recursively.
     */
    public function toCamelCase(): self
    {
        $clone = clone $this;

        $normalized = is_array($clone->value)
            ? $clone->value
            : $clone->convertToArray($clone->value);

        $clone->value = $clone->convertKeysRecursive(
            $normalized,
            static function (string $key): string {
                return self::toCamelCaseKey($key);
            }
        );

        return $clone;
    }

    /**
     * Encodes the current value as a JSON string.
     *
     * JSON_THROW_ON_ERROR is always enabled to surface encoding issues.
     * When the current value is an object or Traversable, it is first
     * converted to an array recursively before encoding.
     */
    public function toJson(int $options = 0): string
    {
        $value = $this->value;

        if (is_object($value) || $value instanceof Traversable) {
            $value = $this->convertToArray($value);
        }

        try {
            return json_encode($value, JSON_THROW_ON_ERROR | $options);
        } catch (JsonException $exception) {
            throw new InvalidArgumentException(
                'JSON encoding failed for the current value.',
                previous: $exception
            );
        }
    }

    /**
     * Converts a scalar, array or object into an array representation recursively.
     *
     * @return array<mixed>
     */
    private function convertToArray(mixed $value): array
    {
        if (is_array($value)) {
            $result = [];

            foreach ($value as $key => $item) {
                if (is_array($item) || is_object($item)) {
                    $result[$key] = $this->convertToArray($item);
                } else {
                    $result[$key] = $item;
                }
            }

            return $result;
        }

        if (is_object($value)) {
            if (method_exists($value, 'toArray')) {
                $result = $value->toArray();

                if (!is_array($result)) {
                    throw new InvalidArgumentException('The toArray method did not return an array.');
                }

                return $this->convertToArray($result);
            }

            if ($value instanceof JsonSerializable) {
                $jsonData = $value->jsonSerialize();

                return $this->convertToArray(
                    is_array($jsonData) ? $jsonData : (array) $jsonData
                );
            }

            if ($value instanceof Traversable) {
                $arrayData = iterator_to_array($value);

                return $this->convertToArray($arrayData);
            }

            $vars = get_object_vars($value);

            return $this->convertToArray($vars);
        }

        if ($value === null) {
            return [];
        }

        if (is_scalar($value)) {
            return [$value];
        }

        throw new InvalidArgumentException('Cannot convert the provided value to array.');
    }

    /**
     * Applies a key transformation recursively to an array structure.
     *
     * Nested arrays and objects are processed recursively.
     *
     * @param array<mixed>             $data
     * @param callable(string): string $caseConverter
     *
     * @return array<mixed>
     */
    private function convertKeysRecursive(array $data, callable $caseConverter): array
    {
        $result = [];

        foreach ($data as $key => $value) {
            $normalizedKey = is_string($key) ? $caseConverter($key) : $key;

            if (is_array($value)) {
                $result[$normalizedKey] = $this->convertKeysRecursive($value, $caseConverter);
                continue;
            }

            if (is_object($value)) {
                $arrayValue = $this->convertToArray($value);
                $result[$normalizedKey] = $this->convertKeysRecursive($arrayValue, $caseConverter);
                continue;
            }

            $result[$normalizedKey] = $value;
        }

        return $result;
    }

    /**
     * Converts a string key to snake_case.
     */
    private static function toSnakeCaseKey(string $key): string
    {
        $normalized = preg_replace('/([a-z\d])([A-Z])/', '$1_$2', $key);
        $normalized = preg_replace('/[\s\-]+/', '_', (string) $normalized);

        return strtolower((string) $normalized);
    }

    /**
     * Converts a string key to camelCase.
     */
    private static function toCamelCaseKey(string $key): string
    {
        $normalized = str_replace(['-', ' '], '_', strtolower($key));

        return preg_replace_callback(
            '/_([a-z0-9])/',
            static fn(array $matches): string => strtoupper($matches[1]),
            $normalized
        );
    }
}
