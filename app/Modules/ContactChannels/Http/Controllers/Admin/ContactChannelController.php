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
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

final class ContactChannelController extends Controller
{
    private const DEFAULT_PER_PAGE = 15;

    private const SORTABLE_COLUMNS = [
        'channel_type',
        'label',
        'value',
        'is_active',
        'sort_order',
    ];

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

    public function index(Request $request): Response
    {
        $perPage = $this->resolvePerPage($request);
        $search = $this->resolveSearch($request->query('search'));
        $type = $this->resolveType($request->query('type'));
        $isActive = $this->resolveActiveFilter($request->query('active'));
        $sort = $this->resolveTableSort($request->query('sort'), self::SORTABLE_COLUMNS);
        $direction = $this->resolveTableDirection($request->query('direction'), $sort, 'asc');
        $channels = $this->listContactChannels->handle(
            $perPage,
            $search,
            $type,
            $isActive,
            $sort,
            $direction,
        );

        return Inertia::render('contact-channels/admin/Index', [
            'channels' => $this->paginatedChannelsPayload($channels),
            'channelTypes' => $this->channelTypesPayload(),
            'filters' => [
                'per_page' => $perPage,
                'search' => $search,
                'type' => $type,
                'active' => $this->activeFilterValue($isActive),
                'sort' => $sort,
                'direction' => $direction,
            ],
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
            ->back()
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

    private function resolveSearch(mixed $rawSearch): ?string
    {
        if (!is_string($rawSearch)) {
            return null;
        }

        $search = trim($rawSearch);

        return $search === '' ? null : $search;
    }

    private function resolvePerPage(Request $request): int
    {
        $perPage = $request->integer('per_page', self::DEFAULT_PER_PAGE);

        if ($perPage < 1) {
            return self::DEFAULT_PER_PAGE;
        }

        return min($perPage, 100);
    }

    private function resolveType(mixed $rawType): ?string
    {
        if (!is_string($rawType)) {
            return null;
        }

        $type = trim($rawType);

        return ContactChannelType::tryFrom($type)?->value;
    }

    private function resolveActiveFilter(mixed $rawActive): ?bool
    {
        if (!is_string($rawActive)) {
            return null;
        }

        return match (trim($rawActive)) {
            'active' => true,
            'inactive' => false,
            default => null,
        };
    }

    private function activeFilterValue(?bool $isActive): ?string
    {
        return match ($isActive) {
            true => 'active',
            false => 'inactive',
            default => null,
        };
    }

    /**
     * @return array{
     *     data: array<int,array<string,mixed>>,
     *     current_page: int,
     *     last_page: int,
     *     per_page: int,
     *     from: int|null,
     *     to: int|null,
     *     total: int,
     *     path: string,
     *     links: array<int,array{url:string|null,label:string,active:bool}>
     * }
     */
    private function paginatedChannelsPayload(LengthAwarePaginator $paginator): array
    {
        $items = collect($paginator->items())
            ->map(fn(ContactChannel $channel): array => ContactChannelMapper::map(
                ContactChannelDto::fromModel($channel, $this->hrefBuilder),
            ))
            ->values()
            ->all();

        return [
            'data' => $items,
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
            'total' => $paginator->total(),
            'path' => $paginator->path(),
            'links' => $paginator->linkCollection()
                ->map(static fn(array $link): array => [
                    'url' => $link['url'],
                    'label' => (string) $link['label'],
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
        ];
    }
}
