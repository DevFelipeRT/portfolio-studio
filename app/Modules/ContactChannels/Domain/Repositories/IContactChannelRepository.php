<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Domain\Repositories;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface IContactChannelRepository
{
    /**
     * @return EloquentCollection<int,ContactChannel>
     */
    public function allOrdered(): EloquentCollection;

    /**
     * @return EloquentCollection<int,ContactChannel>
     */
    public function activeOrdered(): EloquentCollection;

    /**
     * @return EloquentCollection<int,ContactChannel>
     */
    public function activeOrderedWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection;

    public function findById(int $id): ContactChannel;

    /**
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): ContactChannel;

    /**
     * @param array<string,mixed> $attributes
     */
    public function update(ContactChannel $channel, array $attributes): ContactChannel;

    public function toggleActive(ContactChannel $channel, bool $isActive): ContactChannel;

    /**
     * @param array<int,array{id:int,sort_order:int}> $orders
     */
    public function reorder(array $orders): void;

    public function delete(ContactChannel $channel): void;
}
