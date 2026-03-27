<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjects;

use App\Modules\Projects\Application\Mappers\ProjectAdminOutputMapper;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Models\Project;

final class ListProjects
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly ProjectAdminOutputMapper $projectAdminOutputMapper,
    ) {
    }

    public function handle(ListProjectsInput $input): ListProjectsOutput
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $projects = $this->projects->paginateAdminList(
            perPage: $input->perPage,
            search: $input->search,
            status: $input->status,
            visibility: $input->visibility,
            sort: $input->sort,
            direction: $input->direction,
            locale: $locale,
            fallbackLocale: $fallbackLocale,
            page: $input->page,
        );

        return new ListProjectsOutput(
            items: array_map(
                fn(Project $project): ListProjectItem => $this->projectAdminOutputMapper->toListItem(
                    $project,
                    $locale,
                    $fallbackLocale,
                ),
                $projects->items(),
            ),
            currentPage: $projects->currentPage(),
            lastPage: $projects->lastPage(),
            perPage: $projects->perPage(),
            from: $projects->firstItem(),
            to: $projects->lastItem(),
            total: $projects->total(),
            path: $projects->path(),
            links: $projects->linkCollection()
                ->map(static fn(array $link): array => [
                    'url' => $link['url'],
                    'label' => (string) $link['label'],
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
        );
    }
}
