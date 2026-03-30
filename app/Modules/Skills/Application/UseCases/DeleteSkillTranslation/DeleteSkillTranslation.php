<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillTranslation;

use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use InvalidArgumentException;

final class DeleteSkillTranslation
{
    public function __construct(
        private readonly ISkillRepository $skills,
        private readonly ISkillTranslationRepository $translations,
    ) {
    }

    public function handle(DeleteSkillTranslationInput $input): DeleteSkillTranslationOutput
    {
        $skill = $this->skills->findById($input->skillId);

        $existing = $this->translations->findBySkillAndLocale($skill, $input->locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Skill translation not found for this locale.');
        }

        $this->translations->delete($existing);

        return new DeleteSkillTranslationOutput(
            skillId: $skill->id,
            locale: $input->locale,
        );
    }
}
