<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ReorderContactChannels;

final class ReorderContactChannelsItem
{
    public function __construct(
        public readonly int $id,
        public readonly int $sortOrder,
    ) {
    }
}
