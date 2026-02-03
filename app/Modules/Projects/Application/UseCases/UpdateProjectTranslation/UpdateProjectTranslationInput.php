<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProjectTranslation;

final class UpdateProjectTranslationInput
{
    public function __construct(
        public readonly int $projectId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly ?string $repositoryUrl,
        public readonly ?string $liveUrl,
    ) {
    }
}
