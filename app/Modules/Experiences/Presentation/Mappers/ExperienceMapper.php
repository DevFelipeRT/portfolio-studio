<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Mapping\Mapper;
use App\Modules\Experiences\Application\Services\ExperienceTranslationResolver;
use App\Modules\Experiences\Domain\Models\Experience;

final class ExperienceMapper extends Mapper
{
    protected static string $modelClass = Experience::class;

    protected static function map(mixed $model): array
    {
        /** @var Experience $experience */
        $experience = $model;
        $resolver = app(ExperienceTranslationResolver::class);
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $position = $resolver->resolvePosition($experience, $locale, $fallbackLocale);
        $company = $resolver->resolveCompany($experience, $locale, $fallbackLocale);
        $summary = $resolver->resolveSummary($experience, $locale, $fallbackLocale);
        $description = $resolver->resolveDescription($experience, $locale, $fallbackLocale);

        return [
            'id' => $experience->id,
            'locale' => $experience->locale,
            'position' => $position,
            'company' => $company,
            'summary' => $summary,
            'description' => $description,
            'start_date' => self::formatDate($experience->start_date),
            'end_date' => self::formatDate($experience->end_date),
            'display' => $experience->display,
            'created_at' => self::formatDate($experience->created_at),
            'updated_at' => self::formatDate($experience->updated_at),
        ];
    }
}
