<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Services;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Models\ExperienceTranslation;

final class ExperienceTranslationResolver
{
    public function resolvePosition(
        Experience $experience,
        string $locale,
        ?string $fallbackLocale = null,
    ): string {
        return (string) $this->resolveField(
            $experience->translations,
            'position',
            $locale,
            $fallbackLocale,
            $experience->position,
        );
    }

    public function resolveCompany(
        Experience $experience,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        return $this->resolveField(
            $experience->translations,
            'company',
            $locale,
            $fallbackLocale,
            $experience->company,
        );
    }

    public function resolveSummary(
        Experience $experience,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        return $this->resolveField(
            $experience->translations,
            'summary',
            $locale,
            $fallbackLocale,
            $experience->summary,
        );
    }

    public function resolveDescription(
        Experience $experience,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        return $this->resolveField(
            $experience->translations,
            'description',
            $locale,
            $fallbackLocale,
            $experience->description,
        );
    }

    /**
     * @param iterable<int,ExperienceTranslation> $translations
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
