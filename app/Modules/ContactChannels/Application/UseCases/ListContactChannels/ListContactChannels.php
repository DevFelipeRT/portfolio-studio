<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ListContactChannels;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

final class ListContactChannels
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
    ) {
    }

    /**
     * @return array<int,ContactChannelDto>
     */
    public function handle(): array
    {
        $channels = $this->repository->allOrdered();

        return $channels
            ->map(fn($channel) => ContactChannelDto::fromModel($channel, $this->hrefBuilder))
            ->all();
    }
}
