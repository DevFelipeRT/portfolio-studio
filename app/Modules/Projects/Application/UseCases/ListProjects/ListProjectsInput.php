<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjects;

use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;

final readonly class ListProjectsInput
{
    public function __construct(
        public int $perPage = 15,
        public int $page = 1,
        public ?string $search = null,
        public ?ProjectStatus $status = null,
        public ?string $visibility = null,
        public ?string $sort = null,
        public ?string $direction = null,
    ) {
    }
}
