<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ReorderContactChannels;

final class ReorderContactChannelsInput
{
    /**
     * @param array<int,ReorderContactChannelsItem> $items
     */
    public function __construct(
        public readonly array $items,
    ) {
    }
}
