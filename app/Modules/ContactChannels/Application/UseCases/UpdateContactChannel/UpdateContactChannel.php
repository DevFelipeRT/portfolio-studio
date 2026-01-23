<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\UpdateContactChannel;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Application\Services\ContactChannelValueNormalizer;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

final class UpdateContactChannel
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly ContactChannelValueNormalizer $normalizer,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
    ) {
    }

    public function handle(
        ContactChannel $channel,
        UpdateContactChannelInput $input,
    ): ContactChannelDto {
        $normalizedValue = $this->normalizer->normalize(
            $input->channelType,
            $input->value,
        );

        $updated = $this->repository->update($channel, [
            'channel_type' => $input->channelType,
            'label' => $input->label,
            'value' => $normalizedValue,
            'is_active' => $input->isActive,
            'sort_order' => $input->sortOrder,
        ]);

        return ContactChannelDto::fromModel($updated, $this->hrefBuilder);
    }
}
