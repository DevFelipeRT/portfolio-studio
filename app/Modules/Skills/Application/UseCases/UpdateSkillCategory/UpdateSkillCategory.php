<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategory;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillCategorySlugNormalizer;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class UpdateSkillCategory
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
        private readonly SkillCategorySlugNormalizer $slugNormalizer,
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    public function handle(
        SkillCategory $category,
        UpdateSkillCategoryInput $input,
    ): SkillCategoryDto {
        $updated = $this->repository->update($category, [
            'name' => $input->name,
            'slug' => $this->slugNormalizer->normalize($input->name, $input->slug),
        ]);

        $updated->loadMissing('translations');

        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $name = $this->translationResolver->resolveCategoryName(
            $updated,
            $locale,
            $fallbackLocale,
        );

        return SkillCategoryDto::fromModel($updated, $name);
    }
}
