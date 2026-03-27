<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Mappers;

use App\Modules\Projects\Application\UseCases\ListProjects\ListProjectsInput;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use Illuminate\Http\Request;

final class ListProjectsInputMapper
{
    private const SORTABLE_COLUMNS = [
        'name',
        'status',
        'display',
        'image_count',
    ];

    public function fromRequest(Request $request): ListProjectsInput
    {
        $sorting = $this->parseSorting(
            $request->query('sort'),
            $request->query('direction'),
        );

        return new ListProjectsInput(
            perPage: $this->parsePerPage($request->query('per_page')),
            page: $this->parsePage($request->query('page')),
            search: $this->parseTextFilter($request->query('search')),
            status: $this->parseStatus($request->query('status')),
            visibility: $this->parseVisibility($request->query('visibility')),
            sort: $sorting['sort'],
            direction: $sorting['direction'],
        );
    }

    private function parsePerPage(
        mixed $value,
        int $default = 15,
        int $max = 100,
    ): int {
        if (!is_numeric($value)) {
            return $default;
        }

        $perPage = (int) $value;

        if ($perPage < 1) {
            return $default;
        }

        return min($perPage, $max);
    }

    private function parsePage(mixed $value, int $default = 1): int
    {
        if (!is_numeric($value)) {
            return $default;
        }

        return max((int) $value, 1);
    }

    private function parseTextFilter(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $parsed = trim($value);

        return $parsed === '' ? null : $parsed;
    }

    private function parseStatus(mixed $value): ?ProjectStatus
    {
        $parsed = $this->parseTextFilter($value);

        if ($parsed === null) {
            return null;
        }

        return ProjectStatus::tryFromScalar($parsed);
    }

    private function parseVisibility(mixed $value): ?string
    {
        $parsed = $this->parseTextFilter($value);

        return match ($parsed) {
            'public', 'private' => $parsed,
            default => null,
        };
    }

    /**
     * @return array{sort:?string,direction:?string}
     */
    private function parseSorting(
        mixed $rawSort,
        mixed $rawDirection,
        string $defaultDirection = 'desc',
    ): array {
        $sort = $this->parseSort($rawSort);
        $direction = $this->parseDirection($rawDirection, $sort, $defaultDirection);

        return [
            'sort' => $sort,
            'direction' => $direction,
        ];
    }

    private function parseSort(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $parsed = trim($value);

        return in_array($parsed, self::SORTABLE_COLUMNS, true) ? $parsed : null;
    }

    private function parseDirection(
        mixed $value,
        ?string $sort,
        string $defaultDirection,
    ): ?string {
        if ($sort === null || !is_string($value)) {
            return null;
        }

        return $value === 'asc'
            ? 'asc'
            : ($value === 'desc' ? 'desc' : $defaultDirection);
    }
}
