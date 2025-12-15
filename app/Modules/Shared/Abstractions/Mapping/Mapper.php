<?php

declare(strict_types=1);

namespace App\Modules\Shared\Abstractions\Mapping;

use App\Modules\Shared\Contracts\Enums\IEnum;
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
     * Map a many-to-many related models collection with optional pivot data.
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param iterable<TModel>                     $models
     * @param callable(TModel): array<string,mixed> $modelMapper
     * @param callable(object|null): array<string,mixed>|null $pivotMapper
     * @return array<int,array<string,mixed>>
     */
    protected static function mapRelatedWithPivot(
        iterable $models,
        callable $modelMapper,
        ?callable $pivotMapper = null
    ): array {
        return collect($models)
            ->map(static function ($model) use ($modelMapper, $pivotMapper): array {
                $base = $modelMapper($model);

                if ($pivotMapper === null) {
                    return $base;
                }

                $pivotData = $pivotMapper($model->pivot ?? null);

                return \array_merge($base, $pivotData);
            })
            ->values()
            ->all();
    }

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
    protected static function getEnumLabel(?IEnum $enum): ?string
    {
        return $enum?->label();
    }
}
