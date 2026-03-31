<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Mappers;

use App\Modules\Projects\Application\Services\ProjectTranslationResolver;
use App\Modules\Projects\Application\UseCases\GetProjectDetails\GetProjectDetailsOutput;
use App\Modules\Projects\Application\UseCases\ListProjects\ListProjectItem;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Support\Collection;

final class ProjectAdminOutputMapper
{
    public function __construct(
        private readonly ProjectTranslationResolver $translationResolver,
    ) {
    }

    public function toListItem(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): ListProjectItem {
        return new ListProjectItem(
            id: $project->id,
            locale: $project->locale,
            name: $this->translationResolver->resolveName(
                $project,
                $locale,
                $fallbackLocale,
            ),
            summary: $this->translationResolver->resolveSummary(
                $project,
                $locale,
                $fallbackLocale,
            ),
            status: $this->translationResolver->resolveStatus(
                $project,
                $locale,
                $fallbackLocale,
            ),
            display: (bool) $project->display,
            imageCount: is_numeric($project->images_count ?? null)
                ? (int) $project->images_count
                : 0,
        );
    }

    public function toDetail(
        Project $project,
        string $locale,
        ?string $fallbackLocale = null,
    ): GetProjectDetailsOutput {
        /** @var Collection<int,Image> $images */
        $images = $project->images instanceof Collection
            ? $project->images
            : collect();

        return new GetProjectDetailsOutput(
            id: $project->id,
            locale: $project->locale,
            name: $this->translationResolver->resolveName(
                $project,
                $locale,
                $fallbackLocale,
            ),
            summary: $this->translationResolver->resolveSummary(
                $project,
                $locale,
                $fallbackLocale,
            ),
            description: $this->translationResolver->resolveDescription(
                $project,
                $locale,
                $fallbackLocale,
            ),
            status: $this->translationResolver->resolveStatus(
                $project,
                $locale,
                $fallbackLocale,
            ),
            repositoryUrl: $this->translationResolver->resolveRepositoryUrl(
                $project,
                $locale,
                $fallbackLocale,
            ),
            liveUrl: $this->translationResolver->resolveLiveUrl(
                $project,
                $locale,
                $fallbackLocale,
            ),
            display: (bool) $project->display,
            createdAt: $this->formatDate($project->created_at),
            updatedAt: $this->formatDate($project->updated_at),
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
                    static fn(Skill $skill): array => [
                        'id' => $skill->id,
                        'name' => $skill->name,
                    ],
                )
                ->values()
                ->all(),
        );
    }

    private function formatDate(mixed $date): ?string
    {
        return $date?->format('Y-m-d');
    }
}
