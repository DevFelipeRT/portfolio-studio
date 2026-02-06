<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ListContactChannelTranslations;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelTranslationDto;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelTranslationRepository;

final class ListContactChannelTranslations
{
    public function __construct(
        private readonly IContactChannelTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,ContactChannelTranslationDto>
     */
    public function handle(ContactChannel $channel): array
    {
        $items = $this->translations->listByChannel($channel);

        return $items
            ->map(static fn($translation): ContactChannelTranslationDto => ContactChannelTranslationDto::fromModel($translation))
            ->all();
    }
}
