<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Dtos;

use App\Modules\Projects\Domain\Models\ProjectTranslation;

final class ProjectTranslationDto
{
    public function __construct(
        public readonly int $id,
        public readonly int $projectId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $summary,
        public readonly ?string $description,
        public readonly ?string $repositoryUrl,
        public readonly ?string $liveUrl,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }

    public static function fromModel(ProjectTranslation $translation): self
    {
        return new self(
            id: $translation->id,
            projectId: $translation->project_id,
            locale: $translation->locale,
            name: $translation->name,
            summary: $translation->summary,
            description: $translation->description,
            repositoryUrl: $translation->repository_url,
            liveUrl: $translation->live_url,
            createdAt: $translation->created_at?->toJSON(),
            updatedAt: $translation->updated_at?->toJSON(),
        );
    }

    /**
     * @return array<string,mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->projectId,
            'locale' => $this->locale,
            'name' => $this->name,
            'summary' => $this->summary,
            'description' => $this->description,
            'repository_url' => $this->repositoryUrl,
            'live_url' => $this->liveUrl,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
