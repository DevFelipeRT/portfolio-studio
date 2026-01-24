<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\Services;

use App\Modules\Images\Domain\Models\Image;

final class SeoSettingsResolver
{
    private const array DEFAULT_ROBOTS = [
        'public' => [
            'index' => true,
            'follow' => true,
        ],
        'private' => [
            'index' => false,
            'follow' => false,
        ],
    ];

    public function __construct(private readonly WebsiteSettingsService $settingsService)
    {
    }

    public function resolveMetaTitle(
        ?string $pageTitle,
        ?string $pageMetaTitle,
        string $locale,
    ): string {
        $settings = $this->settingsService->getSettings();

        $baseTitle = $pageMetaTitle ?: $pageTitle;

        if ($baseTitle === null || $baseTitle === '') {
            $baseTitle = $this->settingsService->getLocalizedValue(
                $settings->default_meta_title,
                $locale,
            ) ?? $this->settingsService->getLocalizedValue(
                $settings->site_name,
                $locale,
            ) ?? '';
        }

        $template = $settings->meta_title_template;

        if (!is_string($template) || trim($template) === '') {
            return $baseTitle ?? '';
        }

        $replacements = [
            '{page_title}' => $baseTitle ?? '',
            '{owner}' => $settings->owner_name ?? '',
            '{site}' => $this->settingsService->getLocalizedValue($settings->site_name, $locale) ?? '',
            '{locale}' => $locale,
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    public function resolveMetaDescription(?string $pageMetaDescription, string $locale): ?string
    {
        if ($pageMetaDescription !== null && $pageMetaDescription !== '') {
            return $pageMetaDescription;
        }

        $settings = $this->settingsService->getSettings();

        return $this->settingsService->getLocalizedValue(
            $settings->default_meta_description,
            $locale,
        ) ?? $this->settingsService->getLocalizedValue(
            $settings->site_description,
            $locale,
        );
    }

    public function resolveMetaImageUrl(?string $pageMetaImageUrl): ?string
    {
        if (is_string($pageMetaImageUrl) && $pageMetaImageUrl !== '') {
            return $pageMetaImageUrl;
        }

        $settings = $this->settingsService->getSettings();

        $imageId = $settings->default_meta_image_id
            ?? $settings->default_og_image_id
            ?? $settings->default_twitter_image_id;

        if ($imageId === null) {
            return null;
        }

        $image = Image::query()->find($imageId);

        return $image?->url;
    }

    /**
     * @return array{index:bool,follow:bool}
     */
    public function resolveRobots(string $scope, ?bool $pageIndexable = null): array
    {
        $settings = $this->settingsService->getSettings();
        $robots = is_array($settings->robots) ? $settings->robots : [];
        $defaults = self::DEFAULT_ROBOTS[$scope] ?? self::DEFAULT_ROBOTS['public'];

        $scopeConfig = $robots[$scope] ?? [];

        $globalIndex = array_key_exists('index', $scopeConfig)
            ? (bool) $scopeConfig['index']
            : (bool) $defaults['index'];
        $globalFollow = array_key_exists('follow', $scopeConfig)
            ? (bool) $scopeConfig['follow']
            : (bool) $defaults['follow'];

        $index = $globalIndex;

        if ($globalIndex && $pageIndexable !== null) {
            $index = (bool) $pageIndexable;
        }

        return [
            'index' => $index,
            'follow' => $globalFollow,
        ];
    }

    public function renderRobotsMeta(array $directives): string
    {
        $index = ($directives['index'] ?? true) ? 'index' : 'noindex';
        $follow = ($directives['follow'] ?? true) ? 'follow' : 'nofollow';

        return $index . ', ' . $follow;
    }
}
