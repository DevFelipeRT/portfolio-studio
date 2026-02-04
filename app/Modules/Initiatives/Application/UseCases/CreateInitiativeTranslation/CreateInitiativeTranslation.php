<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\CreateInitiativeTranslation;

use App\Modules\Initiatives\Application\Dtos\InitiativeTranslationDto;
use App\Modules\Initiatives\Application\Services\SupportedLocalesResolver;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeTranslationRepository;
use InvalidArgumentException;

final class CreateInitiativeTranslation
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly IInitiativeTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
    ) {
    }

    public function handle(CreateInitiativeTranslationInput $input): InitiativeTranslationDto
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw new InvalidArgumentException('Unsupported locale for initiative translation.');
        }

        $initiative = $this->initiatives->findById($input->initiativeId);

        if ($input->locale === $initiative->locale) {
            throw new InvalidArgumentException('Initiative translation locale must differ from base locale.');
        }

        $existing = $this->translations->findByInitiativeAndLocale($initiative, $input->locale);
        if ($existing !== null) {
            throw new InvalidArgumentException('Initiative translation already exists for this locale.');
        }

        $payload = $this->normalizePayload($input);
        if ($this->isPayloadEmpty($payload)) {
            throw new InvalidArgumentException('Initiative translation requires at least one translated field.');
        }

        $translation = $this->translations->create($initiative, $input->locale, $payload);

        return InitiativeTranslationDto::fromModel($translation);
    }

    /**
     * @return array{
     *   name?:string|null,
     *   summary?:string|null,
     *   description?:string|null
     * }
     */
    private function normalizePayload(CreateInitiativeTranslationInput $input): array
    {
        return [
            'name' => $this->normalizeText($input->name),
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
     * @param array{
     *   name?:string|null,
     *   summary?:string|null,
     *   description?:string|null
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
