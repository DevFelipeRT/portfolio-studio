<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\CreateContactChannel;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;

final class CreateContactChannelInput
{
    public function __construct(
        public readonly ContactChannelType $channelType,
        public readonly ?string $label,
        public readonly string $value,
        public readonly string $locale,
        public readonly bool $isActive,
        public readonly int $sortOrder,
    ) {
    }
}
