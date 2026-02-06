<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Services;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Models\InitiativeTranslation;

final class InitiativeTranslationResolver
{
    public function resolveName(
        Initiative $initiative,
        string $locale,
        ?string $fallbackLocale = null,
    ): string {
        if ($locale === $initiative->locale) {
            return (string) $initiative->name;
        }

        return (string) $this->resolveField(
            $initiative->translations,
            'name',
            $locale,
            $fallbackLocale,
            $initiative->name,
        );
    }

    public function resolveSummary(
        Initiative $initiative,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $initiative->locale) {
            return $initiative->summary;
        }

        return $this->resolveField(
            $initiative->translations,
            'summary',
            $locale,
            $fallbackLocale,
            $initiative->summary,
        );
    }

    public function resolveDescription(
        Initiative $initiative,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $initiative->locale) {
            return $initiative->description;
        }

        return $this->resolveField(
            $initiative->translations,
            'description',
            $locale,
            $fallbackLocale,
            $initiative->description,
        );
    }

    /**
     * @param iterable<int,InitiativeTranslation> $translations
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
