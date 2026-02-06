<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\CreateContactChannelTranslation;

final class CreateContactChannelTranslationInput
{
    public function __construct(
        public readonly int $contactChannelId,
        public readonly string $locale,
        public readonly ?string $label,
    ) {
    }
}
