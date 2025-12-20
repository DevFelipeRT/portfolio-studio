<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Capabilities\Dtos;

use App\Modules\Experiences\Domain\Models\Experience;

/**
 * Data transfer object for a public visible experience item.
 */
final class VisibleExperienceItem
{
    public function __construct(
        private readonly int $id,
        private readonly string $position,
        private readonly string $company,
        private readonly ?string $shortDescription,
        private readonly ?string $longDescription,
        private readonly ?string $startDate,
        private readonly ?string $endDate,
        private readonly bool $display,
    ) {
    }

    public static function fromModel(Experience $experience): self
    {
        return new self(
            $experience->id,
            (string) $experience->position,
            (string) $experience->company,
            $experience->short_description,
            $experience->long_description,
            $experience->start_date?->format('Y-m-d'),
            $experience->end_date?->format('Y-m-d'),
            (bool) $experience->display,
        );
    }

    /**
     * Converts the DTO to a serializable array shape.
     *
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'position' => $this->position,
            'company' => $this->company,
            'short_description' => $this->shortDescription,
            'long_description' => $this->longDescription,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'display' => $this->display,
        ];
    }
}
