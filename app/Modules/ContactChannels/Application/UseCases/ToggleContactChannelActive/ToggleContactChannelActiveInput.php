<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ToggleContactChannelActive;

final class ToggleContactChannelActiveInput
{
    public function __construct(
        public readonly bool $isActive,
    ) {
    }
}
