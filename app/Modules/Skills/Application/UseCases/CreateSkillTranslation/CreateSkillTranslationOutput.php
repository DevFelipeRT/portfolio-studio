<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillTranslation;

final readonly class CreateSkillTranslationOutput
{
    public function __construct(
        public int $id,
        public int $skillId,
        public string $locale,
        public string $name,
        public ?string $createdAt,
        public ?string $updatedAt,
    ) {
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'skill_id' => $this->skillId,
            'locale' => $this->locale,
            'name' => $this->name,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
