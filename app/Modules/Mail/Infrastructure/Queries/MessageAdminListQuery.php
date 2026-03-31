<?php

declare(strict_types=1);

namespace App\Modules\Mail\Infrastructure\Queries;

use App\Modules\Mail\Domain\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class MessageAdminListQuery
{
    public function paginate(
        int $perPage,
        int $page,
        ?string $search,
        ?string $seenFilter,
        ?string $importantFilter,
        ?string $sort,
        ?string $direction,
    ): LengthAwarePaginator {
        $builder = $this->filteredQuery($search, $seenFilter, $importantFilter);
        $builder = $this->applySort($builder, $sort, $direction);

        return $builder
            ->paginate($perPage, ['*'], 'page', max($page, 1))
            ->withQueryString();
    }

    /**
     * @return array{results_unread_count:int,results_important_count:int}
     */
    public function stats(
        ?string $search,
        ?string $seenFilter,
        ?string $importantFilter,
    ): array {
        $baseQuery = $this->filteredQuery($search, $seenFilter, $importantFilter);

        return [
            'results_unread_count' => (clone $baseQuery)->where('messages.seen', false)->count(),
            'results_important_count' => (clone $baseQuery)->where('messages.important', true)->count(),
        ];
    }

    private function filteredQuery(
        ?string $search,
        ?string $seenFilter,
        ?string $importantFilter,
    ): Builder {
        return $this->applyImportantFilter(
            $this->applySeenFilter(
                $this->applySearchFilter(Message::query(), $search),
                $seenFilter,
            ),
            $importantFilter,
        );
    }

    private function applySearchFilter(Builder $query, ?string $search): Builder
    {
        $trimmed = trim((string) $search);

        if ($trimmed === '') {
            return $query;
        }

        $like = '%' . addcslashes($trimmed, '\\%_') . '%';

        return $query->where(static function (Builder $nestedQuery) use ($like): void {
            $nestedQuery
                ->where('messages.name', 'like', $like)
                ->orWhere('messages.email', 'like', $like)
                ->orWhere('messages.message', 'like', $like);
        });
    }

    private function applySeenFilter(Builder $query, ?string $seenFilter): Builder
    {
        return match ($seenFilter) {
            'seen' => $query->where('messages.seen', true),
            'unseen' => $query->where('messages.seen', false),
            default => $query,
        };
    }

    private function applyImportantFilter(
        Builder $query,
        ?string $importantFilter,
    ): Builder {
        return match ($importantFilter) {
            'important' => $query->where('messages.important', true),
            'regular' => $query->where('messages.important', false),
            default => $query,
        };
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        $resolvedDirection = $direction === 'asc' ? 'asc' : 'desc';

        return match ($sort) {
            'name' => $query
                ->orderBy('messages.name', $resolvedDirection)
                ->orderByDesc('messages.created_at')
                ->orderByDesc('messages.id'),
            'seen' => $query
                ->orderBy('messages.seen', $resolvedDirection)
                ->orderByDesc('messages.important')
                ->orderByDesc('messages.created_at')
                ->orderByDesc('messages.id'),
            'important' => $query
                ->orderBy('messages.important', $resolvedDirection)
                ->orderByDesc('messages.created_at')
                ->orderByDesc('messages.id'),
            'created_at' => $query
                ->orderBy('messages.created_at', $resolvedDirection)
                ->orderByDesc('messages.id'),
            default => $this->applyDefaultSort($query),
        };
    }

    private function applyDefaultSort(Builder $query): Builder
    {
        return $query
            ->orderByDesc('messages.important')
            ->orderByDesc('messages.created_at')
            ->orderByDesc('messages.id');
    }
}
