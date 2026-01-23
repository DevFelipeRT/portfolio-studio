<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ToggleContactChannelActive;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

final class ToggleContactChannelActive
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
    ) {
    }

    public function handle(
        ContactChannel $channel,
        ToggleContactChannelActiveInput $input,
    ): ContactChannelDto {
        $updated = $this->repository->toggleActive($channel, $input->isActive);

        return ContactChannelDto::fromModel($updated, $this->hrefBuilder);
    }
}
