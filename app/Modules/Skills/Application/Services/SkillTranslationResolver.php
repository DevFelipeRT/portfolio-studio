<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Services;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Models\SkillCategory;

final class SkillTranslationResolver
{
    public function resolveSkillName(
        Skill $skill,
        string $locale,
        ?string $fallbackLocale = null,
    ): string {
        $translation = $this->resolveTranslation($skill->translations, $locale, $fallbackLocale);

        return $translation ?? $skill->name;
    }

    public function resolveCategoryName(
        SkillCategory $category,
        string $locale,
        ?string $fallbackLocale = null,
    ): string {
        $translation = $this->resolveTranslation($category->translations, $locale, $fallbackLocale);

        return $translation ?? $category->name;
    }

    /**
     * @param iterable<int,object> $translations
     */
    private function resolveTranslation(
        iterable $translations,
        string $locale,
        ?string $fallbackLocale,
    ): ?string {
        $localized = null;
        $fallback = null;

        foreach ($translations as $translation) {
            if (!isset($translation->locale, $translation->name)) {
                continue;
            }

            if ($translation->locale === $locale) {
                $localized = $translation->name;
                break;
            }

            if ($fallbackLocale !== null && $translation->locale === $fallbackLocale) {
                $fallback = $translation->name;
            }
        }

        return $localized ?? $fallback;
    }
}
