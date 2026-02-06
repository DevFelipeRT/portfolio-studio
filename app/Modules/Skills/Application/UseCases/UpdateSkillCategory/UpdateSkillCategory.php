<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategory;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillCategoryLocaleSwapService;
use App\Modules\Skills\Application\Services\SkillCategorySlugNormalizer;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use Illuminate\Support\Facades\DB;

final class UpdateSkillCategory
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
        private readonly SkillCategorySlugNormalizer $slugNormalizer,
        private readonly ISkillCategoryTranslationRepository $translations,
        private readonly SkillCategoryLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(
        SkillCategory $category,
        UpdateSkillCategoryInput $input,
    ): SkillCategoryDto {
        $updated = DB::transaction(function () use ($category, $input): SkillCategory {
            $localeChanged = $input->locale !== $category->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findByCategoryAndLocale(
                    $category,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $category = $this->localeSwapService->swap($category, $input->locale);
            } else {
                $this->repository->update($category, [
                    'name' => $input->name,
                    'locale' => $input->locale,
                ]);
            }

            return $this->repository->update($category, [
                'slug' => $this->slugNormalizer->normalize($input->name, $input->slug),
            ]);
        });

        return SkillCategoryDto::fromModel($updated);
    }
}
