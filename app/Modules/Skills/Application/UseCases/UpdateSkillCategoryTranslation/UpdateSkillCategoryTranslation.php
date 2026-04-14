<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class UpdateSkillCategoryTranslation
{
    public function __construct(
        private readonly ISkillCategoryRepository $categories,
        private readonly ISkillCategoryTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
        private readonly SkillTranslationOutputMapper $skillTranslationOutputMapper,
    ) {
    }

    public function handle(UpdateSkillCategoryTranslationInput $input): UpdateSkillCategoryTranslationOutput
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw ValidationException::withMessages([
                'locale' => ['Unsupported locale for skill category translation.'],
            ]);
        }

        $category = $this->categories->findById($input->skillCategoryId);

        if ($input->locale === $category->locale) {
            throw ValidationException::withMessages([
                'locale' => ['Skill category translation locale must differ from base locale.'],
            ]);
        }

        $existing = $this->translations->findByCategoryAndLocale($category, $input->locale);
        if ($existing === null) {
            throw new NotFoundHttpException('Skill category translation not found for this locale.');
        }

        $updated = $this->translations->update($existing, $input->name);

        return $this->skillTranslationOutputMapper->toUpdateSkillCategoryTranslationOutput($updated);
    }
}
