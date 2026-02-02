<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillTranslations;

use App\Modules\Skills\Application\Dtos\SkillTranslationDto;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;

final class ListSkillTranslations
{
    public function __construct(
        private readonly ISkillTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,SkillTranslationDto>
     */
    public function handle(Skill $skill): array
    {
        $items = $this->translations->listBySkill($skill);

        return $items
            ->map(static fn($translation): SkillTranslationDto => SkillTranslationDto::fromModel($translation))
            ->all();
    }
}
