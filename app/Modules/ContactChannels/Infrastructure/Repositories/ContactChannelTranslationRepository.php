<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Infrastructure\Repositories;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Models\ContactChannelTranslation;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class ContactChannelTranslationRepository implements IContactChannelTranslationRepository
{
    public function listByChannel(ContactChannel $channel): EloquentCollection
    {
        return $channel->translations()->orderBy('locale')->get();
    }

    public function findByChannelAndLocale(
        ContactChannel $channel,
        string $locale,
    ): ?ContactChannelTranslation {
        return $channel
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(
        ContactChannel $channel,
        string $locale,
        ?string $label,
    ): ContactChannelTranslation {
        return $channel->translations()->create([
            'locale' => $locale,
            'label' => $label,
        ]);
    }

    public function update(
        ContactChannelTranslation $translation,
        ?string $label,
    ): ContactChannelTranslation {
        $translation->update([
            'label' => $label,
        ]);

        return $translation;
    }

    public function delete(ContactChannelTranslation $translation): void
    {
        $translation->delete();
    }
}
