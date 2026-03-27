<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjectTranslations;

use App\Modules\Projects\Application\Mappers\ProjectTranslationOutputMapper;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;

final class ListProjectTranslations
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
        private readonly ProjectTranslationOutputMapper $projectTranslationOutputMapper,
    ) {
    }

    public function handle(ListProjectTranslationsInput $input): ListProjectTranslationsOutput
    {
        $project = $this->projects->findById($input->projectId);

        return new ListProjectTranslationsOutput(
            items: $this->translations
                ->listByProject($project)
                ->map(fn($translation): ListProjectTranslationItem => $this->projectTranslationOutputMapper->toListItem($translation))
                ->all(),
        );
    }
}
