<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ReorderContactChannels;

use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;

final class ReorderContactChannels
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
    ) {
    }

    public function handle(ReorderContactChannelsInput $input): void
    {
        $orders = array_map(
            static fn(ReorderContactChannelsItem $item): array => [
                'id' => $item->id,
                'sort_order' => $item->sortOrder,
            ],
            $input->items,
        );

        $this->repository->reorder($orders);
    }
}
