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
    public function paginateWithTranslations(
        int $perPage,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator {
        return $this->withTranslations(
            Experience::query(),
            $locale,
            $fallbackLocale,
        )
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->paginate($perPage);
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
