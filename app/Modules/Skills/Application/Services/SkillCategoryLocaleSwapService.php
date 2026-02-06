<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Services;

use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use Illuminate\Support\Facades\DB;

final class SkillCategoryLocaleSwapService
{
    public function __construct(
        private readonly ISkillCategoryRepository $categories,
        private readonly ISkillCategoryTranslationRepository $translations,
    ) {
    }

    public function swap(SkillCategory $category, string $newLocale): SkillCategory
    {
        return DB::transaction(function () use ($category, $newLocale): SkillCategory {
            $translation = $this->translations->findByCategoryAndLocale($category, $newLocale);

            if ($translation === null) {
                return $category;
            }

            $oldLocale = $category->locale;
            $baseName = $category->name;
            $newName = $translation->name;

            $this->categories->update($category, [
                'locale' => $newLocale,
                'name' => $newName,
            ]);

            $existingOldTranslation = $this->translations->findByCategoryAndLocale(
                $category,
                $oldLocale,
            );

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $baseName);
            } else {
                $this->translations->create($category, $oldLocale, $baseName);
            }

            $this->translations->delete($translation);

            return $category->refresh();
        });
    }
}
