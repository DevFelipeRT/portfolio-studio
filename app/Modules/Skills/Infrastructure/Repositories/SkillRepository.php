<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Repositories;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class SkillRepository implements ISkillRepository
{
    public function allWithCategory(): EloquentCollection
    {
        return Skill::query()
            ->with('category')
            ->orderBy('skill_category_id')
            ->orderBy('name')
            ->get();
    }

    public function allWithCategoryAndTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): EloquentCollection {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        $query = Skill::query()
            ->with('category');

        if ($locales !== []) {
            $query->with([
                'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
                'category.translations' => static fn($relation) => $relation->whereIn('locale', $locales),
            ]);
        }

        return $query
            ->orderBy('skill_category_id')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id): Skill
    {
        return Skill::query()->findOrFail($id);
    }

    public function create(array $attributes): Skill
    {
        return Skill::query()->create($attributes);
    }

    public function update(Skill $skill, array $attributes): Skill
    {
        $skill->update($attributes);

        return $skill;
    }

    public function delete(Skill $skill): void
    {
        $skill->delete();
    }

    /**
     * @return array<int,string>
     */
    private function normalizeLocales(?string $locale, ?string $fallbackLocale): array
    {
        $values = array_filter([
            $locale !== null ? trim($locale) : null,
            $fallbackLocale !== null ? trim($fallbackLocale) : null,
        ]);

        return array_values(array_unique($values));
    }
}
