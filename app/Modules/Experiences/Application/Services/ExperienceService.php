<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Services;

use App\Modules\Experiences\Domain\Models\Experience;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Application service for managing experiences.
 */
class ExperienceService
{
    /**
     * Retrieve all experiences ordered by most recent first.
     *
     * @return Collection<int,Experience>
     */
    public function all(): Collection
    {
        return Experience::query()
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Retrieve a paginated list of experiences ordered by most recent first.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Experience::query()
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    /**
     * Find a single experience by its primary key.
     */
    public function find(int $id): ?Experience
    {
        /** @var Experience|null $experience */
        $experience = Experience::query()->find($id);

        return $experience;
    }

    /**
     * Create a new experience from validated attributes.
     *
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): Experience
    {
        /** @var Experience $experience */
        $experience = Experience::query()->create($attributes);

        return $experience;
    }

    /**
     * Update an existing experience with validated attributes.
     *
     * @param array<string,mixed> $attributes
     */
    public function update(Experience $experience, array $attributes): Experience
    {
        $experience->fill($attributes);
        $experience->save();

        return $experience;
    }

    /**
     * Delete an experience instance.
     */
    public function delete(Experience $experience): bool
    {
        return (bool) $experience->delete();
    }

    /**
     * Retrieve only experiences flagged for display, ordered by most recent first.
     *
     * @return Collection<int,Experience>
     */
    public function visible(): Collection
    {
        return Experience::query()
            ->where('display', true)
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }
}
