<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\CreateProject;

final readonly class CreateProjectOutput
{
    public function __construct(
        public int $projectId,
    ) {
    }
}
