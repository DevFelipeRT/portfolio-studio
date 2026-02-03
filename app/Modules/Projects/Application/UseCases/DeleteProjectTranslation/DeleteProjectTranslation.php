<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\DeleteProjectTranslation;

use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use InvalidArgumentException;

final class DeleteProjectTranslation
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
    ) {
    }

    public function handle(int $projectId, string $locale): void
    {
        $project = $this->projects->findById($projectId);

        $existing = $this->translations->findByProjectAndLocale($project, $locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Project translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
