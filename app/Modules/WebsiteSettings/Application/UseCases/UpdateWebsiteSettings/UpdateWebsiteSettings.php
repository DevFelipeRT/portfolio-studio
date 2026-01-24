<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\UseCases\UpdateWebsiteSettings;

use App\Modules\WebsiteSettings\Application\Dtos\WebsiteSettingsDto;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;
use App\Modules\WebsiteSettings\Domain\Repositories\IWebsiteSettingsRepository;

final class UpdateWebsiteSettings
{
    public function __construct(
        private readonly IWebsiteSettingsRepository $repository,
        private readonly WebsiteSettingsService $settingsService,
    ) {
    }

    public function handle(UpdateWebsiteSettingsInput $input): WebsiteSettingsDto
    {
        $settings = $this->repository->get();
        $updated = $this->repository->update($settings, $input->attributes);
        $this->settingsService->forgetCache();

        return WebsiteSettingsDto::fromModel($updated);
    }
}
