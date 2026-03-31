<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\DeleteProjectTranslation;

final readonly class DeleteProjectTranslationOutput
{
    public function __construct(
        public int $projectId,
        public string $locale,
    ) {
    }
}
