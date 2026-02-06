<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\UpdateContactChannelTranslation;

final class UpdateContactChannelTranslationInput
{
    public function __construct(
        public readonly int $contactChannelId,
        public readonly string $locale,
        public readonly ?string $label,
    ) {
    }
}
