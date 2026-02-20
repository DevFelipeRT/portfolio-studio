<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\CreateProject;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Application\Services\ProjectImageService;
use App\Modules\Projects\Domain\Exceptions\ProjectDescriptionTooLongException;
use App\Modules\Projects\Domain\ValueObjects\ProjectDescription;
use App\Modules\Shared\Contracts\RichText\IRichTextService;
use Illuminate\Support\Facades\DB;

final class CreateProject
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly ProjectImageService $projectImageService,
        private readonly IRichTextService $richText,
    ) {
    }

    public function handle(CreateProjectInput $input): Project
    {
        return DB::transaction(function () use ($input): Project {
            $preparedDescription = $this->richText->prepareForPersistence($input->description, 'description');
            try {
                $projectDescription = ProjectDescription::fromRawAndPlainText(
                    raw: $preparedDescription->normalized(),
                    plainText: $preparedDescription->plainText(),
                );
            } catch (ProjectDescriptionTooLongException $exception) {
                throw \App\Modules\Shared\Support\RichText\Exceptions\RichTextValidationException::forCharacters(
                    field: 'description',
                    maxCharacters: $exception->limit(),
                    actualCharacters: $exception->actual(),
                );
            }

            $project = $this->projects->create([
                'locale' => $input->locale,
                'name' => $input->name,
                'summary' => $input->summary,
                'description' => $projectDescription->raw(),
                'status' => $input->status,
                'repository_url' => $input->repositoryUrl,
                'live_url' => $input->liveUrl,
                'display' => $input->display,
            ]);

            if ($input->skillIds !== []) {
                $project->skills()->sync($input->skillIds);
            }

            if ($input->images !== []) {
                $this->projectImageService->replace($project, $input->images);
            }

            return $project->load(['images', 'skills.category']);
        });
    }
}
