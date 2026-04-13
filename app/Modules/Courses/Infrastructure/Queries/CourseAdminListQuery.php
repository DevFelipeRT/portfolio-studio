<?php

declare(strict_types=1);

namespace App\Modules\Courses\Infrastructure\Queries;

use App\Modules\Courses\Domain\Enums\CourseStatusValue;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\ValueObjects\CourseStatus;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class CourseAdminListQuery
{
    public function paginate(
        int $perPage,
        ?string $search,
        ?string $institution,
        ?CourseStatus $status,
        ?string $visibility,
        ?string $sort,
        ?string $direction,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): LengthAwarePaginator {
        $builder = $this->withTranslations(
            Course::query(),
            $locale,
            $fallbackLocale,
        );

        $builder = $this->applySearch($builder, $search);
        $builder = $this->applyInstitutionFilter($builder, $institution);
        $builder = $this->applyStatusFilter($builder, $status);
        $builder = $this->applyVisibilityFilter($builder, $visibility);
        $builder = $this->applySort($builder, $sort, $direction);

        return $builder
            ->paginate($perPage)
            ->withQueryString();
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

    private function applySearch(Builder $query, ?string $search): Builder
    {
        $term = $this->normalizeSearchTerm($search);

        if ($term === null) {
            return $query;
        }

        $like = $this->toLikePattern($term);

        return $query->where(function (Builder $nestedQuery) use ($like): void {
            $nestedQuery
                ->whereRaw('LOWER(courses.name) like ?', [$like])
                ->orWhereRaw('LOWER(courses.institution) like ?', [$like])
                ->orWhereRaw('LOWER(courses.summary) like ?', [$like]);
        });
    }

    private function applyInstitutionFilter(Builder $query, ?string $institution): Builder
    {
        $term = $this->normalizeSearchTerm($institution);

        if ($term === null) {
            return $query;
        }

        return $query->whereRaw(
            'LOWER(courses.institution) like ?',
            [$this->toLikePattern($term)],
        );
    }

    private function applyStatusFilter(Builder $query, ?CourseStatus $status): Builder
    {
        if ($status === null) {
            return $query;
        }

        $statuses = CourseStatus::resolutionOrder();

        return $query->where(function (Builder $nestedQuery) use ($statuses, $status): void {
            foreach ($statuses as $candidateStatus) {
                if ($candidateStatus->is($status->value())) {
                    $this->applyStatusDefinition($nestedQuery, $candidateStatus->value());
                    break;
                }

                $nestedQuery->whereNot(function (Builder $excludedQuery) use ($candidateStatus): void {
                    $this->applyStatusDefinition($excludedQuery, $candidateStatus->value());
                });
            }
        });
    }

    private function applyVisibilityFilter(Builder $query, ?string $visibility): Builder
    {
        return match ($visibility) {
            'public' => $query->where('courses.display', true),
            'private' => $query->where('courses.display', false),
            default => $query,
        };
    }

    private function applySort(
        Builder $query,
        ?string $sort,
        ?string $direction,
    ): Builder {
        $resolvedDirection = $direction === 'asc' ? 'asc' : 'desc';

        return match ($sort) {
            'name' => $query
                ->orderBy('courses.name', $resolvedDirection)
                ->orderBy('courses.id'),
            'institution' => $query
                ->orderBy('courses.institution', $resolvedDirection)
                ->orderBy('courses.name')
                ->orderBy('courses.id'),
            'started_at' => $query
                ->orderBy('courses.started_at', $resolvedDirection)
                ->orderBy('courses.name')
                ->orderBy('courses.id'),
            'completed_at' => $query
                ->orderBy('courses.completed_at', $resolvedDirection)
                ->orderBy('courses.name')
                ->orderBy('courses.id'),
            'status' => $this
                ->applyStatusSort($query, $resolvedDirection)
                ->orderBy('courses.started_at', 'desc')
                ->orderBy('courses.id'),
            'display' => $query
                ->orderBy('courses.display', $resolvedDirection)
                ->orderBy('courses.started_at', 'desc')
                ->orderBy('courses.id'),
            default => $query
                ->orderByDesc('courses.started_at')
                ->orderBy('courses.name')
                ->orderBy('courses.id'),
        };
    }

    private function applyStatusSort(Builder $query, string $direction): Builder
    {
        [$expression, $bindings] = $this->statusRankExpression();
        $resolvedDirection = $direction === 'asc' ? 'ASC' : 'DESC';

        return $query->orderByRaw(
            $expression . ' ' . $resolvedDirection,
            $bindings,
        );
    }

    /**
     * @return array{0:string,1:array<int,string>}
     */
    private function statusRankExpression(): array
    {
        $cases = [];
        $bindings = [];
        $rank = 1;

        foreach (CourseStatus::sortOrder() as $status) {
            [$conditionSql, $conditionBindings] = $this->compileStatusDefinition($status->value());

            $cases[] = "WHEN {$conditionSql} THEN {$rank}";
            $bindings = [...$bindings, ...$conditionBindings];
            $rank++;
        }

        return [
            "CASE\n                " . implode("\n                ", $cases) . "\n                ELSE 4\n            END",
            $bindings,
        ];
    }

    /**
     * @return array{0:string,1:array<int,string>}
     */
    private function compileStatusDefinition(CourseStatusValue $status): array
    {
        $referenceDay = $this->referenceDayValue();

        return match ($status) {
            CourseStatusValue::PLANNED => [
                '((courses.completed_at IS NULL OR courses.completed_at >= ?) AND (courses.started_at IS NULL OR courses.started_at > ?))',
                [$referenceDay, $referenceDay],
            ],
            CourseStatusValue::COMPLETED => [
                '((courses.completed_at IS NOT NULL AND courses.completed_at < ?) AND (courses.started_at IS NULL OR courses.started_at <= ?))',
                [$referenceDay, $referenceDay],
            ],
            CourseStatusValue::IN_PROGRESS => [
                '((courses.completed_at IS NULL OR courses.completed_at >= ?) AND (courses.started_at IS NULL OR courses.started_at <= ?))',
                [$referenceDay, $referenceDay],
            ],
        };
    }

    private function applyStatusDefinition(Builder $query, CourseStatusValue $status): void
    {
        $referenceDay = $this->referenceDayValue();

        match ($status) {
            CourseStatusValue::PLANNED => $query->where(
                static function (Builder $nestedQuery) use ($referenceDay): void {
                    $nestedQuery
                        ->where(static function (Builder $completedQuery) use ($referenceDay): void {
                            $completedQuery
                                ->whereNull('courses.completed_at')
                                ->orWhere('courses.completed_at', '>=', $referenceDay);
                        })
                        ->where(static function (Builder $startedQuery) use ($referenceDay): void {
                            $startedQuery
                                ->whereNull('courses.started_at')
                                ->orWhere('courses.started_at', '>', $referenceDay);
                        });
                },
            ),
            CourseStatusValue::COMPLETED => $query
                ->whereNotNull('courses.completed_at')
                ->where('courses.completed_at', '<', $referenceDay)
                ->where(static function (Builder $startedQuery) use ($referenceDay): void {
                    $startedQuery
                        ->whereNull('courses.started_at')
                        ->orWhere('courses.started_at', '<=', $referenceDay);
                }),
            CourseStatusValue::IN_PROGRESS => $query
                ->where(static function (Builder $completedQuery) use ($referenceDay): void {
                    $completedQuery
                        ->whereNull('courses.completed_at')
                        ->orWhere('courses.completed_at', '>=', $referenceDay);
                })
                ->where(static function (Builder $startedQuery) use ($referenceDay): void {
                    $startedQuery
                        ->whereNull('courses.started_at')
                        ->orWhere('courses.started_at', '<=', $referenceDay);
                }),
        };
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

    private function normalizeSearchTerm(?string $value): ?string
    {
        $term = trim((string) $value);

        return $term === '' ? null : $term;
    }

    private function toLikePattern(string $value): string
    {
        return '%' . addcslashes(mb_strtolower($value, 'UTF-8'), '\\%_') . '%';
    }

    private function referenceDayValue(): string
    {
        return CarbonImmutable::now()->startOfDay()->format('Y-m-d');
    }
}
