<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListVisibleProjects;

final readonly class ListVisibleProjectsInput
{
    public function __construct(
        public ?string $locale = null,
        public ?string $fallbackLocale = null,
        public ?int $limit = null,
    ) {
    }
}
