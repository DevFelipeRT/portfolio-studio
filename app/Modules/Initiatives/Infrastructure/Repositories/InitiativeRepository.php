<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Infrastructure\Repositories;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class InitiativeRepository implements IInitiativeRepository
{
    public function allWithTranslations(
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Collection {
        return $this->withTranslations(
            $this->baseQuery(),
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
            $this->baseQuery(),
            $locale,
            $fallbackLocale,
        )
            ->where('display', true)
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    public function findById(int $id): Initiative
    {
        return Initiative::query()->findOrFail($id);
    }

    public function create(array $attributes): Initiative
    {
        return Initiative::query()->create($attributes);
    }

    public function update(Initiative $initiative, array $attributes): Initiative
    {
        $initiative->update($attributes);

        return $initiative;
    }

    public function delete(Initiative $initiative): void
    {
        $initiative->delete();
    }

    private function baseQuery(): Builder
    {
        return Initiative::query()->with(['images']);
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
