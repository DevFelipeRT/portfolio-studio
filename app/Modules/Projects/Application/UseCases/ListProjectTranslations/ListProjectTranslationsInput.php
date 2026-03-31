<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjectTranslations;

final readonly class ListProjectTranslationsInput
{
    public function __construct(
        public int $projectId,
    ) {
    }
}
