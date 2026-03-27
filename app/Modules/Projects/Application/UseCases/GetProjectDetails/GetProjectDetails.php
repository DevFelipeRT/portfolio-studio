<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\GetProjectDetails;

use App\Modules\Projects\Application\Mappers\ProjectAdminOutputMapper;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Infrastructure\Queries\ProjectAdminDetailQuery;

final class GetProjectDetails
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly ProjectAdminDetailQuery $projectAdminDetailQuery,
        private readonly ProjectAdminOutputMapper $projectAdminOutputMapper,
    ) {
    }

    public function handle(GetProjectDetailsInput $input): GetProjectDetailsOutput
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();
        $project = $this->projects->findById($input->projectId);

        $project = $this->projectAdminDetailQuery->load(
            $project,
            $locale,
            $fallbackLocale,
        );

        return $this->projectAdminOutputMapper->toDetail(
            $project,
            $locale,
            $fallbackLocale,
        );
    }
}
