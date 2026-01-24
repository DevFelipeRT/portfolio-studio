<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Http\Controllers\Admin;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\WebsiteSettings\Application\UseCases\GetWebsiteSettings\GetWebsiteSettings;
use App\Modules\WebsiteSettings\Application\UseCases\UpdateWebsiteSettings\UpdateWebsiteSettings;
use App\Modules\WebsiteSettings\Http\Mappers\WebsiteSettingsInputMapper;
use App\Modules\WebsiteSettings\Http\Requests\WebsiteSettings\UpdateWebsiteSettingsRequest;
use App\Modules\WebsiteSettings\Presentation\Mappers\WebsiteSettingsMapper;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class WebsiteSettingsController extends Controller
{
    public function __construct(
        private readonly GetWebsiteSettings $getWebsiteSettings,
        private readonly UpdateWebsiteSettings $updateWebsiteSettings,
    ) {
    }

    public function edit(): Response
    {
        $settings = $this->getWebsiteSettings->handle();

        return Inertia::render('WebsiteSettings/Pages/Edit', [
            'settings' => WebsiteSettingsMapper::map($settings),
        ]);
    }

    public function update(UpdateWebsiteSettingsRequest $request): RedirectResponse
    {
        $input = WebsiteSettingsInputMapper::fromUpdateRequest($request);
        $this->updateWebsiteSettings->handle($input);

        return redirect()
            ->route('website-settings.edit')
            ->with('status', 'Website settings updated.');
    }
}
