<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\GetProjectDetails;

final readonly class GetProjectDetailsInput
{
    public function __construct(
        public int $projectId,
    ) {
    }
}
