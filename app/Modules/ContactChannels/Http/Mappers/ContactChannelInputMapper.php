<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Mappers;

use App\Modules\ContactChannels\Application\UseCases\CreateContactChannel\CreateContactChannelInput;
use App\Modules\ContactChannels\Application\UseCases\ReorderContactChannels\ReorderContactChannelsInput;
use App\Modules\ContactChannels\Application\UseCases\ReorderContactChannels\ReorderContactChannelsItem;
use App\Modules\ContactChannels\Application\UseCases\ToggleContactChannelActive\ToggleContactChannelActiveInput;
use App\Modules\ContactChannels\Application\UseCases\UpdateContactChannel\UpdateContactChannelInput;
use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\ReorderContactChannelsRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\StoreContactChannelRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\ToggleContactChannelRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\UpdateContactChannelRequest;

final class ContactChannelInputMapper
{
    public static function fromStoreRequest(StoreContactChannelRequest $request): CreateContactChannelInput
    {
        $data = $request->validated();

        return new CreateContactChannelInput(
            channelType: ContactChannelType::from($data['channel_type']),
            label: $data['label'] ?? null,
            value: $data['value'],
            isActive: $data['is_active'] ?? true,
            sortOrder: $data['sort_order'] ?? 0,
        );
    }

    public static function fromUpdateRequest(
        UpdateContactChannelRequest $request,
        ContactChannel $channel,
    ): UpdateContactChannelInput {
        $data = $request->validated();

        return new UpdateContactChannelInput(
            channelType: ContactChannelType::from($data['channel_type']),
            label: $data['label'] ?? null,
            value: $data['value'],
            isActive: $data['is_active'] ?? (bool) $channel->is_active,
            sortOrder: $data['sort_order'] ?? (int) $channel->sort_order,
        );
    }

    public static function fromReorderRequest(
        ReorderContactChannelsRequest $request,
    ): ReorderContactChannelsInput {
        $data = $request->validated();

        $items = array_map(
            static fn(array $item): ReorderContactChannelsItem => new ReorderContactChannelsItem(
                id: (int) $item['id'],
                sortOrder: (int) $item['sort_order'],
            ),
            $data['items'],
        );

        return new ReorderContactChannelsInput($items);
    }

    public static function fromToggleRequest(
        ToggleContactChannelRequest $request,
    ): ToggleContactChannelActiveInput {
        $data = $request->validated();

        return new ToggleContactChannelActiveInput(
            isActive: (bool) $data['is_active'],
        );
    }
}
