<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use Illuminate\Validation\ValidationException;

final class CreateSkillCategoryTranslation
{
    public function __construct(
        private readonly ISkillCategoryRepository $categories,
        private readonly ISkillCategoryTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
        private readonly SkillTranslationOutputMapper $skillTranslationOutputMapper,
    ) {
    }

    public function handle(CreateSkillCategoryTranslationInput $input): CreateSkillCategoryTranslationOutput
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
        if ($existing !== null) {
            throw ValidationException::withMessages([
                'locale' => ['Skill category translation already exists for this locale.'],
            ]);
        }

        $translation = $this->translations->create(
            $category,
            $input->locale,
            $input->name,
        );

        return $this->skillTranslationOutputMapper->toCreateSkillCategoryTranslationOutput($translation);
    }
}
