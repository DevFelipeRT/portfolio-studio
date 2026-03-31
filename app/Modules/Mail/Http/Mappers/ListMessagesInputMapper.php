<?php

declare(strict_types=1);

namespace App\Modules\Mail\Http\Mappers;

use App\Modules\Mail\Application\UseCases\ListMessages\ListMessagesInput;
use Illuminate\Http\Request;

final class ListMessagesInputMapper
{
    private const SORTABLE_COLUMNS = [
        'name',
        'seen',
        'important',
        'created_at',
    ];

    public function fromRequest(Request $request): ListMessagesInput
    {
        $sorting = $this->parseSorting(
            $request->query('sort'),
            $request->query('direction'),
            'important',
            'desc',
        );

        return new ListMessagesInput(
            perPage: $this->parsePerPage($request->query('per_page')),
            page: $this->parsePage($request->query('page')),
            search: $this->parseTextFilter($request->query('search')),
            seen: $this->parseSeenFilter($request->query('seen')),
            important: $this->parseImportantFilter($request->query('important')),
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

    private function parseSeenFilter(mixed $value): ?string
    {
        $parsed = $this->parseTextFilter($value);

        return match ($parsed) {
            'seen', 'unseen' => $parsed,
            default => null,
        };
    }

    private function parseImportantFilter(mixed $value): ?string
    {
        $parsed = $this->parseTextFilter($value);

        return match ($parsed) {
            'important', 'regular' => $parsed,
            default => null,
        };
    }

    /**
     * @return array{sort:string,direction:string}
     */
    private function parseSorting(
        mixed $rawSort,
        mixed $rawDirection,
        string $defaultSort,
        string $defaultDirection,
    ): array {
        $sort = $this->parseSort($rawSort) ?? $defaultSort;
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
        if ($sort === null) {
            return null;
        }

        if (!is_string($value)) {
            return $defaultDirection;
        }

        return $value === 'asc'
            ? 'asc'
            : ($value === 'desc' ? 'desc' : $defaultDirection);
    }
}
