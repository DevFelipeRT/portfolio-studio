<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListVisibleProjects;

use App\Modules\Projects\Application\Services\ProjectTranslationResolver;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Support\Collection;

final class ListVisibleProjects
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly ProjectTranslationResolver $translationResolver,
    ) {
    }

    public function handle(ListVisibleProjectsInput $input): ListVisibleProjectsOutput
    {
        $locale = $input->locale ?? app()->getLocale();
        $fallbackLocale = $input->fallbackLocale ?? app()->getFallbackLocale();

        $projects = $this->projects->visibleWithTranslations($locale, $fallbackLocale);

        if ($input->limit !== null && $input->limit > 0) {
            $projects = $projects->take($input->limit);
        }

        return new ListVisibleProjectsOutput(
            items: $projects
                ->map(
                    fn(Project $project): ListVisibleProjectItem => $this->mapProject(
                        $project,
                        $locale,
                        $fallbackLocale,
                    ),
                )
                ->values()
                ->all(),
        );
    }

    private function mapProject(
        Project $project,
        string $locale,
        ?string $fallbackLocale,
    ): ListVisibleProjectItem {
        /** @var Collection<int,Image> $images */
        $images = $project->images instanceof Collection
            ? $project->images
            : collect();

        return new ListVisibleProjectItem(
            id: $project->id,
            name: $this->translationResolver->resolveName($project, $locale, $fallbackLocale),
            summary: $this->translationResolver->resolveSummary($project, $locale, $fallbackLocale),
            description: $this->translationResolver->resolveDescription($project, $locale, $fallbackLocale),
            repositoryUrl: $this->translationResolver->resolveRepositoryUrl($project, $locale, $fallbackLocale),
            liveUrl: $this->translationResolver->resolveLiveUrl($project, $locale, $fallbackLocale),
            display: (bool) $project->display,
            images: $images
                ->map(
                    static function (Image $image): array {
                        /** @var object|null $pivot */
                        $pivot = $image->pivot ?? null;

                        return [
                            'id' => $image->id,
                            'url' => $image->url,
                            'alt' => $image->alt_text,
                            'title' => $image->image_title,
                            'caption' => $image->caption,
                            'position' => $pivot?->position ?? null,
                            'is_cover' => (bool) ($pivot->is_cover ?? false),
                            'owner_caption' => $pivot?->caption ?? null,
                        ];
                    },
                )
                ->values()
                ->all(),
            skills: $project->skills
                ->map(
                    static function (Skill $skill): array {
                        return [
                            'id' => $skill->id,
                            'name' => $skill->name,
                            'category' => $skill->category,
                            'skill_category_id' => $skill->skill_category_id,
                        ];
                    },
                )
                ->values()
                ->all(),
        );
    }
}
