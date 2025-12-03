<?php

declare(strict_types=1);

namespace App\Mappers;

use Carbon\CarbonInterface;
use InvalidArgumentException;

abstract class Mapper
{
    /**
     * Fully qualified class name of the model this mapper handles.
     */
    protected static string $modelClass;

    /**
     * Transform a single model to an array for frontend consumption.
     *
     * @param mixed $model
     * @return array<string,mixed>
     */
    public static function toArray(mixed $model): array
    {
        static::assertType($model, static::$modelClass);
        return static::map($model);
    }

    /**
     * Map the model to array (to be implemented by child).
     *
     * @param mixed $model
     * @return array<string,mixed>
     */
    abstract protected static function map(mixed $model): array;

    /**
     * Transform a collection of models to an array.
     *
     * @param iterable $models
     * @return array<int, array<string,mixed>>
     */
    public static function collection(iterable $models): array
    {
        return collect($models)->map(fn($model) => static::toArray($model))->all();
    }

    /**
     * Ensure the model is of expected class.
     *
     * @param mixed $model
     * @param class-string $fqcn
     */
    protected static function assertType(mixed $model, string $fqcn): void
    {
        if (!($model instanceof $fqcn)) {
            throw new InvalidArgumentException(sprintf(
                'Expected instance of %s, got %s',
                $fqcn,
                is_object($model) ? get_class($model) : gettype($model)
            ));
        }
    }

    /**
     * Format a Carbon date instance.
     */
    protected static function formatDate(?CarbonInterface $date): ?string
    {
        return $date?->format('Y-m-d');
    }

    /**
     * Get enum label.
     */
    protected static function getEnumLabel(?\App\Enums\IEnum $enum): ?string
    {
        return $enum?->label();
    }
}
