<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\UpdateExperienceTranslation;

use App\Modules\Experiences\Application\Dtos\ExperienceTranslationDto;
use App\Modules\Experiences\Application\Services\SupportedLocalesResolver;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use App\Modules\Experiences\Domain\Repositories\IExperienceTranslationRepository;
use InvalidArgumentException;

final class UpdateExperienceTranslation
{
    public function __construct(
        private readonly IExperienceRepository $experiences,
        private readonly IExperienceTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
    ) {
    }

    public function handle(UpdateExperienceTranslationInput $input): ExperienceTranslationDto
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw new InvalidArgumentException('Unsupported locale for experience translation.');
        }

        $experience = $this->experiences->findById($input->experienceId);

        if ($input->locale === $experience->locale) {
            throw new InvalidArgumentException('Experience translation locale must differ from base locale.');
        }

        $existing = $this->translations->findByExperienceAndLocale($experience, $input->locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Experience translation not found for this locale.');
        }

        $payload = $this->normalizePayload($input);
        if ($this->isPayloadEmpty($payload)) {
            throw new InvalidArgumentException('Experience translation requires at least one translated field.');
        }

        $updated = $this->translations->update($existing, $payload);

        return ExperienceTranslationDto::fromModel($updated);
    }

    /**
     * @return array{position?:string|null,company?:string|null,summary?:string|null,description?:string|null}
     */
    private function normalizePayload(UpdateExperienceTranslationInput $input): array
    {
        return [
            'position' => $this->normalizeText($input->position),
            'company' => $this->normalizeText($input->company),
            'summary' => $this->normalizeText($input->summary),
            'description' => $this->normalizeText($input->description),
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
     * @param array{position?:string|null,company?:string|null,summary?:string|null,description?:string|null} $payload
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
