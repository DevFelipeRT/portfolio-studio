<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

use App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation\CreateSkillCategoryTranslationOutput;
use App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations\ListSkillCategoryTranslationItem;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation\UpdateSkillCategoryTranslationOutput;

final readonly class SkillCategoryTranslationViewModel
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

    public static function fromOutput(
        ListSkillCategoryTranslationItem|CreateSkillCategoryTranslationOutput|UpdateSkillCategoryTranslationOutput $output,
    ): self {
        return new self(
            id: $output->id,
            skillCategoryId: $output->skillCategoryId,
            locale: $output->locale,
            name: $output->name,
            createdAt: $output->createdAt,
            updatedAt: $output->updatedAt,
        );
    }

    /**
     * @return array{
     *     id:int,
     *     skill_category_id:int,
     *     locale:string,
     *     name:string,
     *     created_at:?string,
     *     updated_at:?string
     * }
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
