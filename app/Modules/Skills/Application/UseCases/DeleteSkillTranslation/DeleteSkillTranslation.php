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

    public function handle(int $skillId, string $locale): void
    {
        $skill = $this->skills->findById($skillId);

        $existing = $this->translations->findBySkillAndLocale($skill, $locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Skill translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
