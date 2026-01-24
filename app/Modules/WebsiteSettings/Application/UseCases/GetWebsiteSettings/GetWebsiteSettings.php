<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\UseCases\GetWebsiteSettings;

use App\Modules\WebsiteSettings\Application\Dtos\WebsiteSettingsDto;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;

final class GetWebsiteSettings
{
    public function __construct(private readonly WebsiteSettingsService $settingsService)
    {
    }

    public function handle(): WebsiteSettingsDto
    {
        $settings = $this->settingsService->getSettings();

        return WebsiteSettingsDto::fromModel($settings);
    }
}
