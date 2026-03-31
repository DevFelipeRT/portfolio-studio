<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProjectTranslation;

final readonly class UpdateProjectTranslationOutput
{
    public function __construct(
        public int $id,
        public int $projectId,
        public string $locale,
        public ?string $name,
        public ?string $summary,
        public ?string $description,
        public ?string $status,
        public ?string $repositoryUrl,
        public ?string $liveUrl,
        public ?string $createdAt,
        public ?string $updatedAt,
    ) {
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
            'status' => $this->status,
            'repository_url' => $this->repositoryUrl,
            'live_url' => $this->liveUrl,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
