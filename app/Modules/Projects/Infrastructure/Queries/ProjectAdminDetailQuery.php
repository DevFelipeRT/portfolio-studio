<?php

declare(strict_types=1);

namespace App\Modules\Projects\Infrastructure\Queries;

use App\Modules\Projects\Domain\Models\Project;

final class ProjectAdminDetailQuery
{
    public function load(
        Project $project,
        ?string $locale,
        ?string $fallbackLocale = null,
    ): Project {
        $project->load([
            'images',
            'skills',
            'translations' => fn($relation) => $relation->whereIn(
                'locale',
                $this->normalizeLocales($locale, $fallbackLocale),
            ),
        ]);

        return $project;
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
