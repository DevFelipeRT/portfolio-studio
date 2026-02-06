<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\UpdateContactChannel;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;

final class UpdateContactChannelInput
{
    public function __construct(
        public readonly ContactChannelType $channelType,
        public readonly ?string $label,
        public readonly string $value,
        public readonly string $locale,
        public readonly bool $confirmSwap,
        public readonly bool $isActive,
        public readonly int $sortOrder,
    ) {
    }
}
