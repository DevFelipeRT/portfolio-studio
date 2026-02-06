<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Infrastructure\Repositories;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;

final class ContactChannelRepository implements IContactChannelRepository
{
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
}
