<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Dtos;

use App\Modules\ContactChannels\Domain\Models\ContactChannelTranslation;

final class ContactChannelTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $contactChannelId,
        public readonly string $locale,
        public readonly ?string $label,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(ContactChannelTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            contactChannelId: $translation->contact_channel_id,
            locale: $translation->locale,
            label: $translation->label,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'contact_channel_id' => $this->contactChannelId,
            'locale' => $this->locale,
            'label' => $this->label,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
