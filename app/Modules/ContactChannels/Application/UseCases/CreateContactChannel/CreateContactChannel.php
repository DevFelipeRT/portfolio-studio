<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\CreateContactChannel;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Application\Services\ContactChannelValueNormalizer;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

final class CreateContactChannel
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly ContactChannelValueNormalizer $normalizer,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
    ) {
    }

    public function handle(CreateContactChannelInput $input): ContactChannelDto
    {
        $normalizedValue = $this->normalizer->normalize(
            $input->channelType,
            $input->value,
        );

        $channel = $this->repository->create([
            'channel_type' => $input->channelType,
            'label' => $input->label,
            'value' => $normalizedValue,
            'is_active' => $input->isActive,
            'sort_order' => $input->sortOrder,
        ]);

        return ContactChannelDto::fromModel($channel, $this->hrefBuilder);
    }
}
