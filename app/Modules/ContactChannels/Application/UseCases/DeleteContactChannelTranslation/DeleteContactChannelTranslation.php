<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\DeleteContactChannelTranslation;

use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelTranslationRepository;
use InvalidArgumentException;

final class DeleteContactChannelTranslation
{
    public function __construct(
        private readonly IContactChannelRepository $channels,
        private readonly IContactChannelTranslationRepository $translations,
    ) {
    }

    public function handle(int $contactChannelId, string $locale): void
    {
        $channel = $this->channels->findById($contactChannelId);
        $existing = $this->translations->findByChannelAndLocale($channel, $locale);

        if ($existing === null) {
            throw new InvalidArgumentException('Contact channel translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
