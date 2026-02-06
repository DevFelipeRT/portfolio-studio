<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Controllers;

use App\Modules\ContactChannels\Application\UseCases\CreateContactChannelTranslation\CreateContactChannelTranslation;
use App\Modules\ContactChannels\Application\UseCases\CreateContactChannelTranslation\CreateContactChannelTranslationInput;
use App\Modules\ContactChannels\Application\UseCases\DeleteContactChannelTranslation\DeleteContactChannelTranslation;
use App\Modules\ContactChannels\Application\UseCases\ListContactChannelTranslations\ListContactChannelTranslations;
use App\Modules\ContactChannels\Application\UseCases\UpdateContactChannelTranslation\UpdateContactChannelTranslation;
use App\Modules\ContactChannels\Application\UseCases\UpdateContactChannelTranslation\UpdateContactChannelTranslationInput;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Http\Requests\ContactChannelTranslation\StoreContactChannelTranslationRequest;
use App\Modules\ContactChannels\Http\Requests\ContactChannelTranslation\UpdateContactChannelTranslationRequest;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Http\JsonResponse;

final class ContactChannelTranslationController extends Controller
{
    public function __construct(
        private readonly ListContactChannelTranslations $listContactChannelTranslations,
        private readonly CreateContactChannelTranslation $createContactChannelTranslation,
        private readonly UpdateContactChannelTranslation $updateContactChannelTranslation,
        private readonly DeleteContactChannelTranslation $deleteContactChannelTranslation,
    ) {
    }

    public function index(ContactChannel $contactChannel): JsonResponse
    {
        $items = $this->listContactChannelTranslations->handle($contactChannel);

        return response()->json([
            'data' => array_map(static fn($dto): array => $dto->toArray(), $items),
        ]);
    }

    public function store(
        StoreContactChannelTranslationRequest $request,
        ContactChannel $contactChannel,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createContactChannelTranslation->handle(
            new CreateContactChannelTranslationInput(
                contactChannelId: $contactChannel->id,
                locale: $data['locale'],
                label: $data['label'],
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ], 201);
    }

    public function update(
        UpdateContactChannelTranslationRequest $request,
        ContactChannel $contactChannel,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateContactChannelTranslation->handle(
            new UpdateContactChannelTranslationInput(
                contactChannelId: $contactChannel->id,
                locale: $data['locale'],
                label: $data['label'],
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ]);
    }

    public function destroy(ContactChannel $contactChannel, string $locale): JsonResponse
    {
        $this->deleteContactChannelTranslation->handle($contactChannel->id, $locale);

        return response()->json(null, 204);
    }
}
