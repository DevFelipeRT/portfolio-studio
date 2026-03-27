<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProject;

final readonly class UpdateProjectOutput
{
    public function __construct(
        public int $projectId,
    ) {
    }
}
