<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillTranslations;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;

final class ListSkillTranslations
{
    public function __construct(
        private readonly ISkillRepository $skills,
        private readonly ISkillTranslationRepository $translations,
        private readonly SkillTranslationOutputMapper $skillTranslationOutputMapper,
    ) {
    }

    public function handle(ListSkillTranslationsInput $input): ListSkillTranslationsOutput
    {
        $skill = $this->skills->findById($input->skillId);
        $items = $this->translations->listBySkill($skill);

        return new ListSkillTranslationsOutput(
            items: $items
                ->map(fn($translation): ListSkillTranslationItem => $this->skillTranslationOutputMapper->toListSkillTranslationItem($translation))
                ->all(),
        );
    }
}
