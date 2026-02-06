<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Dtos;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

final class ContactChannelDto
{
    public function __construct(
        public readonly int $id,
        public readonly ContactChannelType $channelType,
        public readonly ?string $label,
        public readonly string $value,
        public readonly string $href,
        public readonly string $locale,
        public readonly bool $isActive,
        public readonly int $sortOrder,
    ) {
    }

    public static function fromModel(
        ContactChannel $channel,
        ContactChannelHrefBuilder $hrefBuilder,
        ?string $label = null,
    ): self {
        return new self(
            id: $channel->id,
            channelType: $channel->channel_type,
            label: $label ?? $channel->label,
            value: $channel->value,
            href: $hrefBuilder->build($channel->channel_type, $channel->value),
            locale: $channel->locale,
            isActive: (bool) $channel->is_active,
            sortOrder: (int) $channel->sort_order,
        );
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'channel_type' => $this->channelType->value,
            'label' => $this->label,
            'value' => $this->value,
            'href' => $this->href,
            'locale' => $this->locale,
            'is_active' => $this->isActive,
            'sort_order' => $this->sortOrder,
        ];
    }
}
