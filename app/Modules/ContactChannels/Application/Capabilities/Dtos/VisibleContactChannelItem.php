<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Capabilities\Dtos;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

/**
 * Data transfer object for a public visible contact channel.
 */
final class VisibleContactChannelItem
{
    public function __construct(
        private readonly int $id,
        private readonly string $channelType,
        private readonly ?string $label,
        private readonly string $value,
        private readonly string $href,
        private readonly int $sortOrder,
    ) {
    }

    public static function fromModel(
        ContactChannel $channel,
        ContactChannelHrefBuilder $hrefBuilder,
        ?string $label = null,
    ): self {
        return new self(
            $channel->id,
            $channel->channel_type->value,
            $label ?? $channel->label,
            $channel->value,
            $hrefBuilder->build($channel->channel_type, $channel->value),
            (int) $channel->sort_order,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'channel_type' => $this->channelType,
            'label' => $this->label,
            'value' => $this->value,
            'href' => $this->href,
            'sort_order' => $this->sortOrder,
        ];
    }
}
