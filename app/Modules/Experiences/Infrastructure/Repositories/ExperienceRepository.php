<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Infrastructure\Repositories;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class ExperienceRepository implements IExperienceRepository
{
    public function paginate(
        int $perPage,
        ?string $search = null,
        ?string $visibility = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator {
        return $this->applySort(
            $this->applyVisibilityFilter(
                $this->applySearchFilter(
                    Experience::query(),
                    $search,
                ),
                $visibility,
            ),
            $sort,
            $direction,
        )
            ->paginate($perPage)
            ->withQueryString();
    }

    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            Experience::query(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    public function visibleWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            Experience::query(),
            $locale,
            $fallbackLocale,
        )
            ->where('display', true)
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    public function findById(int $id): Experience
    {
        return Experience::query()->findOrFail($id);
    }

    public function create(array $attributes): Experience
    {
        return Experience::query()->create($attributes);
    }

    public function update(Experience $experience, array $attributes): Experience
    {
        $experience->update($attributes);

        return $experience;
    }

    public function delete(Experience $experience): void
    {
        $experience->delete();
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

    private function applySearchFilter(Builder $query, ?string $search): Builder
    {
        $trimmed = trim((string) $search);

        if ($trimmed === '') {
            return $query;
        }

        $like = '%' . addcslashes(mb_strtolower($trimmed, 'UTF-8'), '\\%_') . '%';

        return $query->where(static function (Builder $nestedQuery) use ($like): void {
            $nestedQuery
                ->whereRaw('LOWER(experiences.position) like ?', [$like])
                ->orWhereRaw('LOWER(experiences.company) like ?', [$like])
                ->orWhereRaw('LOWER(experiences.summary) like ?', [$like]);
        });
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

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        return match ($sort) {
            'position' => $query
                ->orderBy('experiences.position', $direction)
                ->orderByDesc('experiences.id'),
            'company' => $query
                ->orderBy('experiences.company', $direction)
                ->orderByDesc('experiences.start_date')
                ->orderByDesc('experiences.id'),
            'start_date' => $query
                ->orderBy('experiences.start_date', $direction)
                ->orderByDesc('experiences.id'),
            'display' => $query
                ->orderBy('experiences.display', $direction)
                ->orderByDesc('experiences.start_date')
                ->orderByDesc('experiences.id'),
            default => $query
                ->orderByDesc('experiences.start_date')
                ->orderByDesc('experiences.id'),
        };
    }

    private function applyVisibilityFilter(
        Builder $query,
        ?string $visibility,
    ): Builder {
        return match ($visibility) {
            'public' => $query->where('experiences.display', true),
            'private' => $query->where('experiences.display', false),
            default => $query,
        };
    }
}
