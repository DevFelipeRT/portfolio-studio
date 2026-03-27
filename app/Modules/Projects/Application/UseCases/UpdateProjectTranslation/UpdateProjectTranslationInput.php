<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProjectTranslation;

use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;

final readonly class UpdateProjectTranslationInput
{
    public function __construct(
        public readonly int $projectId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly ?ProjectStatus $status,
        public readonly ?string $repositoryUrl,
        public readonly ?string $liveUrl,
    ) {
    }
}
