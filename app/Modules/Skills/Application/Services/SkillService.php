<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Services;

use App\Modules\Skills\Domain\Models\Skill;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

/**
 * Service responsible for managing portfolio skills.
 */
class SkillService
{
    /**
     * List all skills ordered by category and name.
     *
     * @return EloquentCollection<int,Skill>
     */
    public function all(): EloquentCollection
    {
        return Skill::query()
            ->with('category')
            ->orderBy('skill_category_id')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all skills grouped by category slug.
     *
     * The outer collection is keyed by the category slug, and each value is
     * an Eloquent collection of Skill models belonging to that category.
     *
     * @return Collection<string,EloquentCollection<int,Skill>>
     */
    public function groupedByCategory(): Collection
    {
        /** @var EloquentCollection<int,Skill> $skills */
        $skills = Skill::query()
            ->with('category')
            ->orderBy('name')
            ->get();

        return $skills->groupBy(
            static fn(Skill $skill): string => $skill->category?->slug ?? 'uncategorized',
        );
    }

    /**
     * Find a single skill by its primary key.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function find(int $id): Skill
    {
        return Skill::query()->findOrFail($id);
    }

    /**
     * Create a new skill.
     */
    public function create(string $name, ?int $categoryId): Skill
    {
        return Skill::query()->create([
            'name' => $name,
            'skill_category_id' => $categoryId,
        ]);
    }

    /**
     * Update the name and category of an existing skill.
     */
    public function rename(
        Skill $skill,
        string $name,
        ?int $categoryId,
    ): Skill {
        $skill->update([
            'name' => $name,
            'skill_category_id' => $categoryId,
        ]);

        return $skill;
    }

    /**
     * Delete a skill.
     */
    public function delete(Skill $skill): void
    {
        $skill->delete();
    }
}
