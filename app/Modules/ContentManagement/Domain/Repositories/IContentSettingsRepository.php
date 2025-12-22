<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Repositories;

use App\Modules\ContentManagement\Domain\Models\ContentSettings;

/**
 * Contract for accessing content management module settings.
 */
interface IContentSettingsRepository
{
    /**
     * Returns the current content settings instance.
     *
     * Implementations are expected to create a default record
     * when none exists yet.
     */
    public function get(): ContentSettings;

    /**
     * Persists the given settings instance.
     */
    public function save(ContentSettings $settings): ContentSettings;
}
