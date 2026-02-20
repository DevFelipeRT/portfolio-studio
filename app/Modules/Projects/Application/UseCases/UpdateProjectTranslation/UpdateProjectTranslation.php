<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\UpdateProjectTranslation;

use App\Modules\Projects\Application\Dtos\ProjectTranslationDto;
use App\Modules\Projects\Application\Services\SupportedLocalesResolver;
use App\Modules\Projects\Domain\Repositories\IProjectRepository;
use App\Modules\Projects\Domain\Repositories\IProjectTranslationRepository;
use App\Modules\Projects\Domain\Exceptions\ProjectDescriptionTooLongException;
use App\Modules\Projects\Domain\ValueObjects\ProjectDescription;
use App\Modules\Shared\Contracts\RichText\IRichTextService;
use InvalidArgumentException;

final class UpdateProjectTranslation
{
    public function __construct(
        private readonly IProjectRepository $projects,
        private readonly IProjectTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
        private readonly IRichTextService $richText,
    ) {
    }

    public function handle(UpdateProjectTranslationInput $input): ProjectTranslationDto
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
        if ($existing === null) {
            throw new InvalidArgumentException('Project translation not found for this locale.');
        }

        $payload = $this->normalizePayload($input);
        if ($this->isPayloadEmpty($payload)) {
            throw new InvalidArgumentException('Project translation requires at least one translated field.');
        }

        $updated = $this->translations->update($existing, $payload);

        return ProjectTranslationDto::fromModel($updated);
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
    private function normalizePayload(UpdateProjectTranslationInput $input): array
    {
        $descriptionRaw = $this->normalizeText($input->description);
        if ($descriptionRaw !== null) {
            $preparedDescription = $this->richText->prepareForPersistence($descriptionRaw, 'description');
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
            $descriptionRaw = $projectDescription->raw();
        }

        return [
            'name' => $this->normalizeText($input->name),
            'summary' => $this->normalizeText($input->summary),
            'description' => $descriptionRaw,
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
