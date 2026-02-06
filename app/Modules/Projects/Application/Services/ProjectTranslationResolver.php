<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Services;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Models\ProjectTranslation;

final class ProjectTranslationResolver
{
    public function resolveName(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): string {
        if ($locale === $project->locale) {
            return (string) $project->name;
        }

        return (string) $this->resolveField(
            $project->translations,
            'name',
            $locale,
            $fallbackLocale,
            $project->name,
        );
    }

    public function resolveSummary(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $project->locale) {
            return $project->summary;
        }

        return $this->resolveField(
            $project->translations,
            'summary',
            $locale,
            $fallbackLocale,
            $project->summary,
        );
    }

    public function resolveDescription(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $project->locale) {
            return $project->description;
        }

        return $this->resolveField(
            $project->translations,
            'description',
            $locale,
            $fallbackLocale,
            $project->description,
        );
    }

    public function resolveRepositoryUrl(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $project->locale) {
            return $project->repository_url;
        }

        return $this->resolveField(
            $project->translations,
            'repository_url',
            $locale,
            $fallbackLocale,
            $project->repository_url,
        );
    }

    public function resolveLiveUrl(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $project->locale) {
            return $project->live_url;
        }

        return $this->resolveField(
            $project->translations,
            'live_url',
            $locale,
            $fallbackLocale,
            $project->live_url,
        );
    }

    /**
     * @param iterable<int,ProjectTranslation> $translations
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
