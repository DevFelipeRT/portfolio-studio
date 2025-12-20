<?php

declare(strict_types=1);

namespace App\Modules\Technologies\Application\Capabilities\Dtos;

use App\Modules\Technologies\Domain\Models\Technology;

/**
 * Data transfer object for a public visible technology item.
 */
final class VisibleTechnologyItem
{
    public function __construct(
        private readonly int $id,
        private readonly string $name,
    ) {
    }

    public static function fromModel(Technology $technology): self
    {
        return new self(
            $technology->id,
            $technology->name,
        );
    }

    /**
     * @return array{id: int, name: string}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
