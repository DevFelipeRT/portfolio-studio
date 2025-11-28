<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TechnologyCategories;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service responsible for managing portfolio technologies.
 */
class TechnologyService
{
    /**
     * List all technologies ordered by name.
     *
     * @return Collection<int,Technology>
     */
    public function all(): Collection
    {
        return Technology::query()
            ->orderBy('category')
            ->orderBy('name')
            ->get();
    }

    /**
     * List all technologies grouped by category.
     *
     * The outer collection is keyed by the category backing value
     * (for example: "backend", "frontend", "tooling"), and each value is
     * a collection of Technology models belonging to that category.
     *
     * @return Collection<string, EloquentCollection<int,Technology>>
     */
    public function groupedByCategory(): Collection
    {
        $technologies = Technology::query()
            ->orderBy('name')
            ->get();

        return $technologies->groupBy(
            fn(Technology $technology): string => $technology->category->value,
        );
    }

    /**
     * Find a single technology by its primary key.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function find(int $id): Technology
    {
        return Technology::query()->findOrFail($id);
    }

    /**
     * Create a new technology.
     */
    public function create(string $name, TechnologyCategories $category): Technology
    {
        return Technology::query()->create([
            'name'     => $name,
            'category' => $category,
        ]);
    }

    /**
     * Update the name and category of an existing technology.
     */
    public function rename(
        Technology $technology,
        string $name,
        TechnologyCategories $category,
    ): Technology {
        $technology->update([
            'name'     => $name,
            'category' => $category,
        ]);

        return $technology;
    }

    /**
     * Delete a technology.
     */
    public function delete(Technology $technology): void
    {
        $technology->delete();
    }
}
