<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillTranslation;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use Illuminate\Validation\ValidationException;

final class CreateSkillTranslation
{
    public function __construct(
        private readonly ISkillRepository $skills,
        private readonly ISkillTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
        private readonly SkillTranslationOutputMapper $skillTranslationOutputMapper,
    ) {
    }

    public function handle(CreateSkillTranslationInput $input): CreateSkillTranslationOutput
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw ValidationException::withMessages([
                'locale' => ['Unsupported locale for skill translation.'],
            ]);
        }

        $skill = $this->skills->findById($input->skillId);

        if ($input->locale === $skill->locale) {
            throw ValidationException::withMessages([
                'locale' => ['Skill translation locale must differ from base locale.'],
            ]);
        }

        $existing = $this->translations->findBySkillAndLocale($skill, $input->locale);
        if ($existing !== null) {
            throw ValidationException::withMessages([
                'locale' => ['Skill translation already exists for this locale.'],
            ]);
        }

        $translation = $this->translations->create(
            $skill,
            $input->locale,
            $input->name,
        );

        return $this->skillTranslationOutputMapper->toCreateSkillTranslationOutput($translation);
    }
}
