<?php

declare(strict_types=1);

namespace App\Modules\Projects\Infrastructure\Repositories;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class ProjectRepository implements IProjectRepository
{
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator {
        return $this->withTranslations(
            $this->baseQuery(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('created_at')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            $this->baseQuery(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();
    }

    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            $this->baseQuery(),
            $locale,
            $fallbackLocale,
        )
            ->where('display', true)
            ->orderByDesc('created_at')
            ->get();
    }

    public function findById(int $id): Project
    {
        return Project::query()->findOrFail($id);
    }

    public function create(array $attributes): Project
    {
        return Project::query()->create($attributes);
    }

    public function update(Project $project, array $attributes): Project
    {
        $project->update($attributes);

        return $project;
    }

    public function delete(Project $project): void
    {
        $project->delete();
    }

    private function baseQuery(): Builder
    {
        return Project::query()->with(['images', 'skills.category']);
    }

    private function withTranslations(
        Builder $query,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Builder {
        $locales = $this->normalizeLocales($locale, $fallbackLocale);

        if ($locales !== []) {
            $query->with([
                'translations' => static fn($relation) => $relation->whereIn('locale', $locales),
            ]);
        }

        return $query;
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
