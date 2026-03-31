<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation;

use App\Modules\Skills\Application\Mappers\SkillTranslationOutputMapper;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use InvalidArgumentException;

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
            throw new InvalidArgumentException('Unsupported locale for skill category translation.');
        }

        $category = $this->categories->findById($input->skillCategoryId);

        if ($input->locale === $category->locale) {
            throw new InvalidArgumentException('Skill category translation locale must differ from base locale.');
        }

        $existing = $this->translations->findByCategoryAndLocale($category, $input->locale);
        if ($existing !== null) {
            throw new InvalidArgumentException('Skill category translation already exists for this locale.');
        }

        $translation = $this->translations->create(
            $category,
            $input->locale,
            $input->name,
        );

        return $this->skillTranslationOutputMapper->toCreateSkillCategoryTranslationOutput($translation);
    }
}
