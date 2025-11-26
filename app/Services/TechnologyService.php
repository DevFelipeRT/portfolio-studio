<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;

/**
 * Service responsible for managing portfolio technologies.
 */
class TechnologyService
{
    /**
     * List all technologies ordered by most recent first.
     *
     * @return Collection<int,Technology>
     */
    public function all(): Collection
    {
        return Technology::query()
            ->orderBy('name')
            ->get();
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
    public function create(string $name): Technology
    {
        return Technology::query()->create([
            'name' => $name,
        ]);
    }

    /**
     * Rename an existing technology.
     */
    public function rename(Technology $technology, string $name): Technology
    {
        $technology->update([
            'name' => $name,
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
