<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Http\Mappers;

use App\Modules\WebsiteSettings\Application\UseCases\UpdateWebsiteSettings\UpdateWebsiteSettingsInput;
use App\Modules\WebsiteSettings\Http\Requests\WebsiteSettings\UpdateWebsiteSettingsRequest;

final class WebsiteSettingsInputMapper
{
    public static function fromUpdateRequest(
        UpdateWebsiteSettingsRequest $request,
    ): UpdateWebsiteSettingsInput {
        return new UpdateWebsiteSettingsInput($request->validated());
    }
}
