<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Presentation\Mappers;

use App\Modules\WebsiteSettings\Application\Dtos\WebsiteSettingsDto;

final class WebsiteSettingsMapper
{
    /**
     * @return array<string,mixed>
     */
    public static function map(WebsiteSettingsDto $dto): array
    {
        return $dto->toArray();
    }
}
