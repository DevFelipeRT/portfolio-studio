<?php

declare(strict_types=1);

namespace App\Modules\Technologies\Application\Capabilities\Dtos;

use App\Modules\Technologies\Domain\Enums\TechnologyCategories;

/**
 * Data transfer object for a public visible technology group.
 *
 * Each group represents a single category with its technologies.
 */
final class VisibleTechnologyGroup
{
    /**
     * @param VisibleTechnologyItem[] $technologies
     */
    public function __construct(
        private readonly string $id,
        private readonly string $title,
        private readonly array $technologies,
    ) {
    }

    /**
     * @param VisibleTechnologyItem[] $technologies
     */
    public static function fromCategoryEnum(
        TechnologyCategories $category,
        array $technologies,
    ): self {
        return new self(
            $category->value,
            $category->label(),
            $technologies,
        );
    }

    /**
     * @return array{
     *     id: string,
     *     title: string,
     *     technologies: array<int, array{id: int, name: string}>
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'technologies' => \array_map(
                static fn(VisibleTechnologyItem $item): array => $item->toArray(),
                $this->technologies,
            ),
        ];
    }
}
