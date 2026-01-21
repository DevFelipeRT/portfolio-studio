<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services\Templates;

use App\Modules\ContentManagement\Domain\Templates\TemplateDefinition;
use Illuminate\Support\Arr;

/**
 * Loads template-specific translations from the templates resources tree.
 */
final class TemplateTranslationService
{
    /**
     * @var array<string,array<string,mixed>>
     */
    private array $cache = [];

    public function translate(
        TemplateDefinition $definition,
        string $key,
        string $locale,
        ?string $fallback = null,
    ): ?string {
        if ($key === '') {
            return $fallback;
        }

        $catalog = $this->loadCatalog($definition, $locale);
        $value = Arr::get($catalog, $key);

        if (is_string($value) && $value !== '') {
            return $value;
        }

        $fallbackLocale = (string) config('content_management.locales.default', '');

        if ($fallbackLocale !== '' && $fallbackLocale !== $locale) {
            $fallbackCatalog = $this->loadCatalog($definition, $fallbackLocale);
            $fallbackValue = Arr::get($fallbackCatalog, $key);

            if (is_string($fallbackValue) && $fallbackValue !== '') {
                return $fallbackValue;
            }
        }

        return $fallback;
    }

    /**
     * @return array<string,mixed>
     */
    private function loadCatalog(TemplateDefinition $definition, string $locale): array
    {
        $origin = $definition->origin();
        $templateName = $definition->templateName();

        if ($origin === '' || $templateName === '' || $locale === '') {
            return [];
        }

        $cacheKey = sprintf('%s::%s::%s', $origin, $templateName, $locale);

        if (array_key_exists($cacheKey, $this->cache)) {
            return $this->cache[$cacheKey];
        }

        $path = resource_path(sprintf(
            'templates/%s/%s/locales/%s.php',
            $origin,
            $templateName,
            $locale,
        ));

        if (!is_file($path)) {
            $this->cache[$cacheKey] = [];
            return [];
        }

        $catalog = require $path;

        if (!is_array($catalog)) {
            $this->cache[$cacheKey] = [];
            return [];
        }

        $this->cache[$cacheKey] = $catalog;

        return $catalog;
    }
}
