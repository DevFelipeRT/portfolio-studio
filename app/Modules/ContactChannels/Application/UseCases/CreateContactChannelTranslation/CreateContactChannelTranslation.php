<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\CreateContactChannelTranslation;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelTranslationDto;
use App\Modules\ContactChannels\Application\Services\SupportedLocalesResolver;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelTranslationRepository;
use InvalidArgumentException;

final class CreateContactChannelTranslation
{
    public function __construct(
        private readonly IContactChannelRepository $channels,
        private readonly IContactChannelTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocalesResolver,
    ) {
    }

    public function handle(CreateContactChannelTranslationInput $input): ContactChannelTranslationDto
    {
        $supported = $this->supportedLocalesResolver->resolve();

        if (!in_array($input->locale, $supported, true)) {
            throw new InvalidArgumentException('Unsupported locale for contact channel translation.');
        }

        $channel = $this->channels->findById($input->contactChannelId);

        if ($input->locale === $channel->locale) {
            throw new InvalidArgumentException('Contact channel translation locale must differ from base locale.');
        }

        $existing = $this->translations->findByChannelAndLocale($channel, $input->locale);

        if ($existing !== null) {
            throw new InvalidArgumentException('Contact channel translation already exists for this locale.');
        }

        $translation = $this->translations->create(
            $channel,
            $input->locale,
            $input->label,
        );

        return ContactChannelTranslationDto::fromModel($translation);
    }
}
