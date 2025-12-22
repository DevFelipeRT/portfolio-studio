<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Infrastructure\Repositories;

use App\Modules\ContentManagement\Domain\Models\ContentSettings;
use App\Modules\ContentManagement\Domain\Repositories\IContentSettingsRepository;

/**
 * Eloquent-backed implementation of the content settings repository contract.
 */
final class ContentSettingsRepository implements IContentSettingsRepository
{
    public function get(): ContentSettings
    {
        $settings = ContentSettings::query()->first();

        if ($settings !== null) {
            return $settings;
        }

        $defaultSlug = (string) config('content_management.pages.home.slug', 'home');

        $settings = new ContentSettings([
            'home_slug' => $defaultSlug,
        ]);

        $settings->save();

        return $settings;
    }

    public function save(ContentSettings $settings): ContentSettings
    {
        $settings->save();

        return $settings;
    }
}
