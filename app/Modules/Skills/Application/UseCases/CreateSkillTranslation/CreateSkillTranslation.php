<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillTranslation;

use App\Modules\Skills\Application\Dtos\SkillTranslationDto;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use InvalidArgumentException;

final class CreateSkillTranslation
{
    public function __construct(
        private readonly ISkillRepository $skills,
        private readonly ISkillTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
    ) {
    }

    public function handle(CreateSkillTranslationInput $input): SkillTranslationDto
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw new InvalidArgumentException('Unsupported locale for skill translation.');
        }

        $skill = $this->skills->findById($input->skillId);

        $existing = $this->translations->findBySkillAndLocale($skill, $input->locale);
        if ($existing !== null) {
            throw new InvalidArgumentException('Skill translation already exists for this locale.');
        }

        $translation = $this->translations->create(
            $skill,
            $input->locale,
            $input->name,
        );

        return SkillTranslationDto::fromModel($translation);
    }
}
