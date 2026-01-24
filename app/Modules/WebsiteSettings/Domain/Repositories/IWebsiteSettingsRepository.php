<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Domain\Repositories;

use App\Modules\WebsiteSettings\Domain\Models\WebsiteSettings;

interface IWebsiteSettingsRepository
{
    public function get(): WebsiteSettings;

    /**
     * @param array<string,mixed> $attributes
     */
    public function update(WebsiteSettings $settings, array $attributes): WebsiteSettings;
}
