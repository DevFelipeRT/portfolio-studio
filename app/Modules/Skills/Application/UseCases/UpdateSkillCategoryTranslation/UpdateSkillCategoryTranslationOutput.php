<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation;

final readonly class UpdateSkillCategoryTranslationOutput
{
    public function __construct(
        public int $id,
        public int $skillCategoryId,
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
            'skill_category_id' => $this->skillCategoryId,
            'locale' => $this->locale,
            'name' => $this->name,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
