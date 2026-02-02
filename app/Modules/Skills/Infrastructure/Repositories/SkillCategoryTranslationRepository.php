<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Repositories;

use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Models\SkillCategoryTranslation;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class SkillCategoryTranslationRepository implements ISkillCategoryTranslationRepository
{
    public function listByCategory(SkillCategory $category): EloquentCollection
    {
        return $category->translations()->orderBy('locale')->get();
    }

    public function findByCategoryAndLocale(
        SkillCategory $category,
        string $locale,
    ): ?SkillCategoryTranslation {
        return $category
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(
        SkillCategory $category,
        string $locale,
        string $name,
    ): SkillCategoryTranslation {
        return $category->translations()->create([
            'locale' => $locale,
            'name' => $name,
        ]);
    }

    public function update(
        SkillCategoryTranslation $translation,
        string $name,
    ): SkillCategoryTranslation {
        $translation->update([
            'name' => $name,
        ]);

        return $translation;
    }

    public function delete(SkillCategoryTranslation $translation): void
    {
        $translation->delete();
    }
}
