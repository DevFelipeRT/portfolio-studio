<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Capabilities\Dtos;

/**
 * Data transfer object for a public visible skill group.
 *
 * Each group represents a single category with its skills.
 */
final class VisibleSkillGroup
{
    /**
     * @param VisibleSkillItem[] $skills
     */
    public function __construct(
        private readonly string $id,
        private readonly string $title,
        private readonly array $skills,
    ) {
    }

    /**
     * @param VisibleSkillItem[] $skills
     */
    public static function fromCategory(
        string $slug,
        string $title,
        array $skills,
    ): self {
        return new self(
            $slug,
            $title,
            $skills,
        );
    }

    /**
     * @return array{
     *     id: string,
     *     title: string,
     *     skills: array<int, array{id: int, name: string}>
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'skills' => \array_map(
                static fn(VisibleSkillItem $item): array => $item->toArray(),
                $this->skills,
            ),
        ];
    }
}
