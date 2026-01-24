<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\UseCases\UpdateWebsiteSettings;

final class UpdateWebsiteSettingsInput
{
    /**
     * @param array<string,mixed> $attributes
     */
    public function __construct(public readonly array $attributes)
    {
    }
}
