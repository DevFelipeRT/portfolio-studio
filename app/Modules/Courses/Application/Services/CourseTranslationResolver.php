<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\Services;

use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Models\CourseTranslation;

final class CourseTranslationResolver
{
    public function resolveName(
        Course $course,
        string $locale,
        ?string $fallbackLocale = null,
    ): string {
        return $this->resolveField(
            $course->translations,
            'name',
            $locale,
            $fallbackLocale,
            $course->name,
        );
    }

    public function resolveInstitution(
        Course $course,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        return $this->resolveField(
            $course->translations,
            'institution',
            $locale,
            $fallbackLocale,
            $course->institution,
        );
    }

    public function resolveSummary(
        Course $course,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        return $this->resolveField(
            $course->translations,
            'summary',
            $locale,
            $fallbackLocale,
            $course->summary,
        );
    }

    public function resolveDescription(
        Course $course,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        return $this->resolveField(
            $course->translations,
            'description',
            $locale,
            $fallbackLocale,
            $course->description,
        );
    }

    /**
     * @param iterable<int,CourseTranslation> $translations
     */
    private function resolveField(
        iterable $translations,
        string $field,
        string $locale,
        ?string $fallbackLocale,
        ?string $default,
    ): ?string {
        $fallback = null;

        foreach ($translations as $translation) {
            if (!isset($translation->locale)) {
                continue;
            }

            $value = $translation->{$field} ?? null;
            $value = is_string($value) ? trim($value) : null;

            if ($translation->locale === $locale) {
                if ($value !== null && $value !== '') {
                    return $value;
                }
                continue;
            }

            if ($fallbackLocale !== null && $translation->locale === $fallbackLocale) {
                if ($value !== null && $value !== '') {
                    $fallback = $value;
                }
            }
        }

        if ($fallback !== null) {
            return $fallback;
        }

        return $default;
    }
}
