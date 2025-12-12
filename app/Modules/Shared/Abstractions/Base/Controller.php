<?php

declare(strict_types=1);

namespace App\Modules\Shared\Abstractions\Base;

use Illuminate\Support\Collection;
use LogicException;
use InvalidArgumentException;

abstract class Controller
{
    /**
     * Map resources from services to arrays suitable for frontend consumption.
     *
     * Each resource must be an array containing:
     *  - service instance
     *  - mapper class name extending App\Mappers\Mapper
     *
     * @param array<string, array{0: object, 1: class-string}> $resources
     *      Associative array of frontend keys => [service, mapper].
     * @param string $method
     *      Method to call on each service (default: 'all').
     *
     * @return array<string, mixed>
     *
     * @throws LogicException
     *      If the service does not have the specified method.
     * @throws InvalidArgumentException
     *      If the resource structure or mapper is invalid.
     */
    protected function mapResources(array $resources, string $method = 'all'): array
    {
        $data = [];

        foreach ($resources as $key => $resource) {
            [$service, $mapper] = $this->validateResourceStructure($key, $resource);
            $this->validateMapperClass($key, $mapper);
            $this->validateServiceMethod($service, $method);

            $result = $service->{$method}();
            $data[$key] = $this->transformResult($result, $mapper);
        }

        return $data;
    }

    /**
     * Transform a paginated collection using a mapper.
     *
     * @template T of object
     * @param \Illuminate\Contracts\Pagination\Paginator|\Illuminate\Pagination\LengthAwarePaginator $paginator
     * @param class-string<Mapper> $mapper
     * @return array{
     *     data: array<int, array<string,mixed>>,
     *     pagination: array{current_page:int,last_page:int,per_page:int,total:int}
     * }
     */
    protected function mapPaginatedResource($paginator, string $mapper): array
    {
        $items = $paginator->items();

        return [
            'data' => $mapper::collection($items),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }


    /**
     * Validate resource structure.
     *
     * @param string $key
     * @param mixed $resource
     * @return array{0: object, 1: class-string}
     *
     * @throws InvalidArgumentException
     */
    private function validateResourceStructure(string $key, mixed $resource): array
    {
        if (!is_array($resource) || count($resource) !== 2) {
            throw new InvalidArgumentException(sprintf(
                'Resource for key "%s" must be an array with [service, mapper].',
                $key
            ));
        }

        [$service, $mapper] = $resource;

        if (!is_object($service)) {
            throw new InvalidArgumentException(sprintf(
                'Service for key "%s" must be an object, got %s.',
                $key,
                gettype($service)
            ));
        }

        return [$service, $mapper];
    }

    /**
     * Validate that the mapper is a valid class extending Mapper.
     *
     * @param string $key
     * @param mixed $mapper
     *
     * @throws InvalidArgumentException
     */
    private function validateMapperClass(string $key, mixed $mapper): void
    {
        if (!is_string($mapper) || !class_exists($mapper)) {
            throw new InvalidArgumentException(sprintf(
                'Mapper for key "%s" must be a valid class name, got %s.',
                $key,
                is_object($mapper) ? get_class($mapper) : gettype($mapper)
            ));
        }

        if (!is_subclass_of($mapper, Mapper::class)) {
            throw new InvalidArgumentException(sprintf(
                'Mapper class "%s" must extend %s.',
                $mapper,
                Mapper::class
            ));
        }
    }

    /**
     * Validate that the service has the required method.
     *
     * @param object $service
     * @param string $method
     *
     * @throws LogicException
     */
    private function validateServiceMethod(object $service, string $method): void
    {
        if (!method_exists($service, $method)) {
            throw new LogicException(sprintf(
                'Service %s must have a method %s.',
                get_class($service),
                $method
            ));
        }
    }

    /**
     * Transform the service result using the mapper.
     *
     * @param mixed $result
     * @param class-string<Mapper> $mapper
     * @return array<int, array<string,mixed>>|array<string,mixed>
     */
    private function transformResult(mixed $result, string $mapper): array
    {
        if ($result instanceof Collection || is_array($result)) {
            return $mapper::collection($result);
        }

        return $mapper::toArray($result);
    }
}
