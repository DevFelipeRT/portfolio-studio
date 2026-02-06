<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Domain\Repositories;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Models\ContactChannelTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface IContactChannelTranslationRepository
{
    /**
     * @return EloquentCollection<int,ContactChannelTranslation>
     */
    public function listByChannel(ContactChannel $channel): EloquentCollection;

    public function findByChannelAndLocale(
        ContactChannel $channel,
        string $locale,
    ): ?ContactChannelTranslation;

    public function create(
        ContactChannel $channel,
        string $locale,
        ?string $label,
    ): ContactChannelTranslation;

    public function update(
        ContactChannelTranslation $translation,
        ?string $label,
    ): ContactChannelTranslation;

    public function delete(ContactChannelTranslation $translation): void;
}
