<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjectTranslations;

use App\Modules\Projects\Application\Dtos\ProjectTranslationDto;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;

final class ListProjectTranslations
{
    public function __construct(
        private readonly IProjectTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,ProjectTranslationDto>
     */
    public function handle(Project $project): array
    {
        return $this->translations
            ->listByProject($project)
            ->map(static fn($translation): ProjectTranslationDto => ProjectTranslationDto::fromModel($translation))
            ->all();
    }
}
