<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\DeleteProject;

final readonly class DeleteProjectOutput
{
    public function __construct(
        public int $projectId,
    ) {
    }
}
