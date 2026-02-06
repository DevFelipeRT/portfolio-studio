<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Services;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelTranslationRepository;
use Illuminate\Support\Facades\DB;

final class ContactChannelLocaleSwapService
{
    public function __construct(
        private readonly IContactChannelRepository $channels,
        private readonly IContactChannelTranslationRepository $translations,
    ) {
    }

    public function swap(ContactChannel $channel, string $newLocale): ContactChannel
    {
        return DB::transaction(function () use ($channel, $newLocale): ContactChannel {
            $translation = $this->translations->findByChannelAndLocale($channel, $newLocale);

            if ($translation === null) {
                return $channel;
            }

            $oldLocale = $channel->locale;
            $baseLabel = $channel->label;
            $newLabel = $translation->label;

            $this->channels->update($channel, [
                'locale' => $newLocale,
                'label' => $newLabel,
            ]);

            $existingOldTranslation = $this->translations->findByChannelAndLocale($channel, $oldLocale);

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $baseLabel);
            } else {
                $this->translations->create($channel, $oldLocale, $baseLabel);
            }

            $this->translations->delete($translation);

            return $channel->refresh();
        });
    }
}
