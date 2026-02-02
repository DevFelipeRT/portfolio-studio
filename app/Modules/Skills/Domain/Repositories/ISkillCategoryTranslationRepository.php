<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Repositories;

use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Models\SkillCategoryTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface ISkillCategoryTranslationRepository
{
    /**
     * @return EloquentCollection<int,SkillCategoryTranslation>
     */
    public function listByCategory(SkillCategory $category): EloquentCollection;

    public function findByCategoryAndLocale(
        SkillCategory $category,
        string $locale,
    ): ?SkillCategoryTranslation;

    public function create(
        SkillCategory $category,
        string $locale,
        string $name,
    ): SkillCategoryTranslation;

    public function update(
        SkillCategoryTranslation $translation,
        string $name,
    ): SkillCategoryTranslation;

    public function delete(SkillCategoryTranslation $translation): void;
}
