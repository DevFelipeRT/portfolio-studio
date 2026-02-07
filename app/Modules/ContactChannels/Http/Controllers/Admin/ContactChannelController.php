<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Controllers\Admin;

use App\Modules\ContactChannels\Application\UseCases\CreateContactChannel\CreateContactChannel;
use App\Modules\ContactChannels\Application\UseCases\DeleteContactChannel\DeleteContactChannel;
use App\Modules\ContactChannels\Application\UseCases\ListContactChannels\ListContactChannels;
use App\Modules\ContactChannels\Application\UseCases\ReorderContactChannels\ReorderContactChannels;
use App\Modules\ContactChannels\Application\UseCases\ToggleContactChannelActive\ToggleContactChannelActive;
use App\Modules\ContactChannels\Application\UseCases\UpdateContactChannel\UpdateContactChannel;
use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;
use App\Modules\ContactChannels\Http\Mappers\ContactChannelInputMapper;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\ReorderContactChannelsRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\StoreContactChannelRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\ToggleContactChannelRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannel\UpdateContactChannelRequest;
use App\Modules\ContactChannels\Presentation\Mappers\ContactChannelMapper;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ContactChannelController extends Controller
{
    public function __construct(
        private readonly ListContactChannels $listContactChannels,
        private readonly CreateContactChannel $createContactChannel,
        private readonly UpdateContactChannel $updateContactChannel,
        private readonly DeleteContactChannel $deleteContactChannel,
        private readonly ReorderContactChannels $reorderContactChannels,
        private readonly ToggleContactChannelActive $toggleContactChannelActive,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
    ) {
    }

    public function index(): Response
    {
        $channels = $this->listContactChannels->handle();

        return Inertia::render('contact-channels/admin/Index', [
            'channels' => ContactChannelMapper::collection($channels),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('contact-channels/admin/Create', [
            'channelTypes' => $this->channelTypesPayload(),
        ]);
    }

    public function edit(ContactChannel $contactChannel): Response
    {
        $dto = ContactChannelDto::fromModel($contactChannel, $this->hrefBuilder);

        return Inertia::render('contact-channels/admin/Edit', [
            'channel' => ContactChannelMapper::map($dto),
            'channelTypes' => $this->channelTypesPayload(),
        ]);
    }

    public function store(StoreContactChannelRequest $request): RedirectResponse
    {
        $input = ContactChannelInputMapper::fromStoreRequest($request);

        $this->createContactChannel->handle($input);

        return redirect()
            ->route('contact-channels.index')
            ->with('status', 'Contact channel created.');
    }

    public function update(
        UpdateContactChannelRequest $request,
        ContactChannel $contactChannel,
    ): RedirectResponse {
        $input = ContactChannelInputMapper::fromUpdateRequest($request, $contactChannel);

        $this->updateContactChannel->handle($contactChannel, $input);

        return redirect()
            ->route('contact-channels.index')
            ->with('status', 'Contact channel updated.');
    }

    public function destroy(ContactChannel $contactChannel): RedirectResponse
    {
        $this->deleteContactChannel->handle($contactChannel);

        return redirect()
            ->route('contact-channels.index')
            ->with('status', 'Contact channel deleted.');
    }

    public function reorder(ReorderContactChannelsRequest $request): RedirectResponse
    {
        $input = ContactChannelInputMapper::fromReorderRequest($request);

        $this->reorderContactChannels->handle($input);

        return redirect()
            ->back()
            ->with('status', 'Contact channels reordered.');
    }

    public function toggleActive(
        ToggleContactChannelRequest $request,
        ContactChannel $contactChannel,
    ): RedirectResponse {
        $input = ContactChannelInputMapper::fromToggleRequest($request);

        $this->toggleContactChannelActive->handle($contactChannel, $input);

        return redirect()
            ->back()
            ->with('status', 'Contact channel status updated.');
    }

    /**
     * @return array<int,array{value:string,label:string}>
     */
    private function channelTypesPayload(): array
    {
        return array_map(
            fn(ContactChannelType $type): array => [
                'value' => $type->value,
                'label' => $this->channelTypeLabel($type),
            ],
            ContactChannelType::cases(),
        );
    }

    private function channelTypeLabel(ContactChannelType $type): string
    {
        return match ($type) {
            ContactChannelType::Email => 'Email',
            ContactChannelType::Phone => 'Phone',
            ContactChannelType::WhatsApp => 'WhatsApp',
            ContactChannelType::LinkedIn => 'LinkedIn',
            ContactChannelType::GitHub => 'GitHub',
            ContactChannelType::Custom => 'Custom',
        };
    }
}
