<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Services;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;

final class ContactChannelTranslationResolver
{
    public function resolveLabel(
        ContactChannel $channel,
        string $locale,
        ?string $fallbackLocale = null,
    ): ?string {
        if ($locale === $channel->locale) {
            return $channel->label;
        }

        $translation = $this->resolveTranslation($channel->translations, $locale, $fallbackLocale);

        return $translation ?? $channel->label;
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
            if (!isset($translation->locale, $translation->label)) {
                continue;
            }

            if ($translation->locale === $locale) {
                $localized = $translation->label;
            }

            if ($fallbackLocale !== null && $translation->locale === $fallbackLocale) {
                $fallback = $translation->label;
            }
        }

        return $localized ?? $fallback;
    }
}
