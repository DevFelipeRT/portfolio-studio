<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\CreateProjectTranslation;

use App\Modules\Projects\Application\Dtos\ProjectTranslationDto;
use App\Modules\Projects\Application\Services\SupportedLocalesResolver;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use InvalidArgumentException;

final class CreateProjectTranslation
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
    ) {
    }

    public function handle(CreateProjectTranslationInput $input): ProjectTranslationDto
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw new InvalidArgumentException('Unsupported locale for project translation.');
        }

        $project = $this->projects->findById($input->projectId);

        if ($input->locale === $project->locale) {
            throw new InvalidArgumentException('Project translation locale must differ from base locale.');
        }

        $existing = $this->translations->findByProjectAndLocale($project, $input->locale);
        if ($existing !== null) {
            throw new InvalidArgumentException('Project translation already exists for this locale.');
        }

        $payload = $this->normalizePayload($input);
        if ($this->isPayloadEmpty($payload)) {
            throw new InvalidArgumentException('Project translation requires at least one translated field.');
        }

        $translation = $this->translations->create($project, $input->locale, $payload);

        return ProjectTranslationDto::fromModel($translation);
    }

    /**
     * @return array{
     *   name?:string|null,
     *   summary?:string|null,
     *   description?:string|null,
     *   status?:string|null,
     *   repository_url?:string|null,
     *   live_url?:string|null
     * }
     */
    private function normalizePayload(CreateProjectTranslationInput $input): array
    {
        return [
            'name' => $this->normalizeText($input->name),
            'summary' => $this->normalizeText($input->summary),
            'description' => $this->normalizeText($input->description),
            'status' => $this->normalizeText($input->status),
            'repository_url' => $this->normalizeText($input->repositoryUrl),
            'live_url' => $this->normalizeText($input->liveUrl),
        ];
    }

    private function normalizeText(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    /**
     * @param array{
     *   name?:string|null,
     *   summary?:string|null,
     *   description?:string|null,
     *   status?:string|null,
     *   repository_url?:string|null,
     *   live_url?:string|null
     * } $payload
     */
    private function isPayloadEmpty(array $payload): bool
    {
        foreach ($payload as $value) {
            if ($value !== null) {
                return false;
            }
        }

        return true;
    }
}
