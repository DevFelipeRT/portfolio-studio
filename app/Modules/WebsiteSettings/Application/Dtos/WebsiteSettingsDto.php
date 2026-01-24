<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\Dtos;

use App\Modules\WebsiteSettings\Domain\Models\WebsiteSettings;

final class WebsiteSettingsDto
{
    /**
     * @param array<string,string>|null $siteName
     * @param array<string,string>|null $siteDescription
     * @param array<int,string>|null $supportedLocales
     * @param array<string,string>|null $defaultMetaTitle
     * @param array<string,string>|null $defaultMetaDescription
     * @param array<string,mixed>|null $robots
     * @param array<string,mixed>|null $systemPages
     * @param array<int,mixed>|null $institutionalLinks
     */
    public function __construct(
        public readonly int $id,
        public readonly ?array $siteName,
        public readonly ?array $siteDescription,
        public readonly ?string $ownerName,
        public readonly ?array $supportedLocales,
        public readonly ?string $defaultLocale,
        public readonly ?string $fallbackLocale,
        public readonly ?string $canonicalBaseUrl,
        public readonly ?string $metaTitleTemplate,
        public readonly ?array $defaultMetaTitle,
        public readonly ?array $defaultMetaDescription,
        public readonly ?int $defaultMetaImageId,
        public readonly ?int $defaultOgImageId,
        public readonly ?int $defaultTwitterImageId,
        public readonly ?array $robots,
        public readonly ?array $systemPages,
        public readonly ?array $institutionalLinks,
        public readonly bool $publicScopeEnabled,
        public readonly bool $privateScopeEnabled,
    ) {
    }

    public static function fromModel(WebsiteSettings $settings): self
    {
        return new self(
            id: $settings->id,
            siteName: $settings->site_name,
            siteDescription: $settings->site_description,
            ownerName: $settings->owner_name,
            supportedLocales: $settings->supported_locales,
            defaultLocale: $settings->default_locale,
            fallbackLocale: $settings->fallback_locale,
            canonicalBaseUrl: $settings->canonical_base_url,
            metaTitleTemplate: $settings->meta_title_template,
            defaultMetaTitle: $settings->default_meta_title,
            defaultMetaDescription: $settings->default_meta_description,
            defaultMetaImageId: $settings->default_meta_image_id,
            defaultOgImageId: $settings->default_og_image_id,
            defaultTwitterImageId: $settings->default_twitter_image_id,
            robots: $settings->robots,
            systemPages: $settings->system_pages,
            institutionalLinks: $settings->institutional_links,
            publicScopeEnabled: (bool) $settings->public_scope_enabled,
            privateScopeEnabled: (bool) $settings->private_scope_enabled,
        );
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'site_name' => $this->siteName,
            'site_description' => $this->siteDescription,
            'owner_name' => $this->ownerName,
            'supported_locales' => $this->supportedLocales,
            'default_locale' => $this->defaultLocale,
            'fallback_locale' => $this->fallbackLocale,
            'canonical_base_url' => $this->canonicalBaseUrl,
            'meta_title_template' => $this->metaTitleTemplate,
            'default_meta_title' => $this->defaultMetaTitle,
            'default_meta_description' => $this->defaultMetaDescription,
            'default_meta_image_id' => $this->defaultMetaImageId,
            'default_og_image_id' => $this->defaultOgImageId,
            'default_twitter_image_id' => $this->defaultTwitterImageId,
            'robots' => $this->robots,
            'system_pages' => $this->systemPages,
            'institutional_links' => $this->institutionalLinks,
            'public_scope_enabled' => $this->publicScopeEnabled,
            'private_scope_enabled' => $this->privateScopeEnabled,
        ];
    }
}
