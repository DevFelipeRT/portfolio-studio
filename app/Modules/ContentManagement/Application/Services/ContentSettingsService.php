<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services;

use App\Modules\ContentManagement\Domain\Models\ContentSettings;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Repositories\IContentSettingsRepository;

/**
 * Application-level service for content module settings.
 *
 * Encapsulates access to the ContentSettings repository and exposes
 * high-level operations related to global content configuration.
 */
final class ContentSettingsService
{
    /**
     * @var IContentSettingsRepository
     */
    private IContentSettingsRepository $settingsRepository;

    public function __construct(IContentSettingsRepository $settingsRepository)
    {
        $this->settingsRepository = $settingsRepository;
    }

    /**
     * Returns the current content settings instance, creating it if necessary.
     */
    public function getSettings(): ContentSettings
    {
        return $this->settingsRepository->get();
    }

    /**
     * Returns the slug used to resolve the home page.
     */
    public function getHomeSlug(): string
    {
        return $this->getSettings()->home_slug;
    }

    /**
     * Updates the slug used to resolve the home page.
     */
    public function setHomeSlug(string $slug): ContentSettings
    {
        $settings = $this->getSettings();
        $settings->home_slug = $slug;

        return $this->settingsRepository->save($settings);
    }

    /**
     * Sets the home slug based on the given page instance.
     */
    public function setHomeFromPage(Page $page): ContentSettings
    {
        return $this->setHomeSlug($page->slug);
    }

    /**
     * Handles a page slug update, keeping the home_slug consistent.
     *
     * When the previous slug matches the current home_slug, the home_slug
     * is updated to the new slug.
     */
    public function handlePageSlugUpdated(string $previousSlug, string $newSlug): void
    {
        if ($previousSlug === $newSlug) {
            return;
        }

        $settings = $this->getSettings();

        if ($settings->home_slug !== $previousSlug) {
            return;
        }

        $settings->home_slug = $newSlug;
        $this->settingsRepository->save($settings);
    }
}
