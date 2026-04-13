<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Infrastructure\Repositories;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;

final class ContactChannelRepository implements IContactChannelRepository
{
    public function paginateOrdered(
        int $perPage,
        ?string $search = null,
        ?string $type = null,
        ?bool $isActive = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator
    {
        return $this->applySort(
            $this->applyActiveFilter(
                $this->applyTypeFilter(
                    $this->applySearchFilter(ContactChannel::query(), $search),
                    $type,
                ),
                $isActive,
            ),
            $sort,
            $direction,
        )
            ->paginate($perPage)
            ->withQueryString();
    }

    public function allOrdered(): EloquentCollection
    {
        return ContactChannel::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function activeOrdered(): EloquentCollection
    {
        return ContactChannel::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function activeOrderedWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        return ContactChannel::query()
            ->where('is_active', true)
            ->when(
                $locales !== [],
                static fn($query) => $query->with([
                    'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
                ]),
            )
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function findById(int $id): ContactChannel
    {
        return ContactChannel::query()->findOrFail($id);
    }

    public function create(array $attributes): ContactChannel
    {
        return ContactChannel::query()->create($attributes);
    }

    public function update(ContactChannel $channel, array $attributes): ContactChannel
    {
        $channel->update($attributes);

        return $channel;
    }

    public function toggleActive(ContactChannel $channel, bool $isActive): ContactChannel
    {
        $channel->update(['is_active' => $isActive]);

        return $channel;
    }

    public function reorder(array $orders): void
    {
        if ($orders === []) {
            return;
        }

        DB::transaction(static function () use ($orders): void {
            foreach ($orders as $order) {
                ContactChannel::query()
                    ->whereKey($order['id'])
                    ->update(['sort_order' => $order['sort_order']]);
            }
        });
    }

    public function delete(ContactChannel $channel): void
    {
        $channel->delete();
    }

    /**
     * @return array<int,string>
     */
    private function normalizeLocales(?string $locale, ?string $fallbackLocale): array
    {
        $candidates = array_unique(array_filter([
            $locale !== null ? trim($locale) : null,
            $fallbackLocale !== null ? trim($fallbackLocale) : null,
        ]));

        return array_values($candidates);
    }

    private function applySearchFilter(Builder $query, ?string $search): Builder
    {
        $trimmed = trim((string) $search);

        if ($trimmed === '') {
            return $query;
        }

        $like = '%' . addcslashes(mb_strtolower($trimmed, 'UTF-8'), '\\%_') . '%';

        return $query->where(static function (Builder $nestedQuery) use ($like): void {
            $nestedQuery
                ->whereRaw('LOWER(contact_channels.label) like ?', [$like])
                ->orWhereRaw('LOWER(contact_channels.value) like ?', [$like]);
        });
    }

    private function applyTypeFilter(Builder $query, ?string $type): Builder
    {
        if ($type === null) {
            return $query;
        }

        $resolvedType = ContactChannelType::tryFrom($type);

        if ($resolvedType === null) {
            return $query;
        }

        return $query->where('contact_channels.channel_type', $resolvedType->value);
    }

    private function applyActiveFilter(Builder $query, ?bool $isActive): Builder
    {
        if ($isActive === null) {
            return $query;
        }

        return $query->where('contact_channels.is_active', $isActive);
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        $resolvedDirection = $direction === 'desc' ? 'desc' : 'asc';

        return match ($sort) {
            'channel_type' => $query
                ->orderBy('contact_channels.channel_type', $resolvedDirection)
                ->orderBy('contact_channels.sort_order')
                ->orderBy('contact_channels.id'),
            'label' => $query
                ->orderBy('contact_channels.label', $resolvedDirection)
                ->orderBy('contact_channels.sort_order')
                ->orderBy('contact_channels.id'),
            'value' => $query
                ->orderBy('contact_channels.value', $resolvedDirection)
                ->orderBy('contact_channels.sort_order')
                ->orderBy('contact_channels.id'),
            'is_active' => $query
                ->orderBy('contact_channels.is_active', $resolvedDirection)
                ->orderBy('contact_channels.sort_order')
                ->orderBy('contact_channels.id'),
            'sort_order' => $query
                ->orderBy('contact_channels.sort_order', $resolvedDirection)
                ->orderBy('contact_channels.id'),
            default => $query
                ->orderBy('contact_channels.sort_order')
                ->orderBy('contact_channels.id'),
        };
    }
}
