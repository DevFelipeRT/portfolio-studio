<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProject;

use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;

final readonly class UpdateProjectInput
{
    /**
     * @param array<int,int> $skillIds
     * @param array<int,array<string,mixed>> $images
     */
    public function __construct(
        public readonly int $projectId,
        public readonly string $locale,
        public readonly bool $confirmSwap,
        public readonly string $name,
        public readonly string $summary,
        public readonly string $description,
        public readonly ProjectStatus $status,
        public readonly ?string $repositoryUrl,
        public readonly ?string $liveUrl,
        public readonly bool $display,
        public readonly array $skillIds = [],
        public readonly array $images = [],
    ) {
    }
}
