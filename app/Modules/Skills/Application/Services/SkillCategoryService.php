<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Services;

use App\Modules\Skills\Domain\Models\SkillCategory;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Str;

/**
 * Service responsible for managing skill categories.
 */
class SkillCategoryService
{
    /**
     * List all categories ordered by name.
     *
     * @return EloquentCollection<int,SkillCategory>
     */
    public function all(): EloquentCollection
    {
        return SkillCategory::query()
            ->orderBy('name')
            ->get();
    }

    /**
     * Find a single category by its primary key.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function find(int $id): SkillCategory
    {
        return SkillCategory::query()->findOrFail($id);
    }

    /**
     * Create a new category.
     */
    public function create(string $name, ?string $slug = null): SkillCategory
    {
        return SkillCategory::query()->create([
            'name' => $name,
            'slug' => $this->normalizeSlug($name, $slug),
        ]);
    }

    /**
     * Update an existing category.
     */
    public function update(
        SkillCategory $category,
        string $name,
        ?string $slug = null,
    ): SkillCategory {
        $category->update([
            'name' => $name,
            'slug' => $this->normalizeSlug($name, $slug),
        ]);

        return $category;
    }

    /**
     * Delete a category.
     */
    public function delete(SkillCategory $category): void
    {
        $category->delete();
    }

    private function normalizeSlug(string $name, ?string $slug): string
    {
        $value = $slug !== null && $slug !== '' ? $slug : $name;

        return Str::slug($value);
    }
}
