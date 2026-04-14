<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillTranslation;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class UpdateSkillTranslation
{
    public function __construct(
        private readonly ISkillRepository $skills,
        private readonly ISkillTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
        private readonly SkillTranslationOutputMapper $skillTranslationOutputMapper,
    ) {
    }

    public function handle(UpdateSkillTranslationInput $input): UpdateSkillTranslationOutput
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
        if ($existing === null) {
            throw new NotFoundHttpException('Skill translation not found for this locale.');
        }

        $updated = $this->translations->update($existing, $input->name);

        return $this->skillTranslationOutputMapper->toUpdateSkillTranslationOutput($updated);
    }
}
