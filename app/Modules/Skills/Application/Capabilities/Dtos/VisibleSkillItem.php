<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Capabilities\Dtos;

use App\Modules\Skills\Domain\Models\Skill;

/**
 * Data transfer object for a public visible skill item.
 */
final class VisibleSkillItem
{
    public function __construct(
        private readonly int $id,
        private readonly string $name,
    ) {
    }

    public static function fromModel(Skill $skill): self
    {
        return new self(
            $skill->id,
            $skill->name,
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
