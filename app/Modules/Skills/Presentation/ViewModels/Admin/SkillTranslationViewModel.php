<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

use App\Modules\Skills\Application\UseCases\CreateSkillTranslation\CreateSkillTranslationOutput;
use App\Modules\Skills\Application\UseCases\ListSkillTranslations\ListSkillTranslationItem;
use App\Modules\Skills\Application\UseCases\UpdateSkillTranslation\UpdateSkillTranslationOutput;

final readonly class SkillTranslationViewModel
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

    public static function fromOutput(
        ListSkillTranslationItem|CreateSkillTranslationOutput|UpdateSkillTranslationOutput $output,
    ): self {
        return new self(
            id: $output->id,
            skillId: $output->skillId,
            locale: $output->locale,
            name: $output->name,
            createdAt: $output->createdAt,
            updatedAt: $output->updatedAt,
        );
    }

    /**
     * @return array{
     *     id:int,
     *     skill_id:int,
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
            'skill_id' => $this->skillId,
            'locale' => $this->locale,
            'name' => $this->name,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
