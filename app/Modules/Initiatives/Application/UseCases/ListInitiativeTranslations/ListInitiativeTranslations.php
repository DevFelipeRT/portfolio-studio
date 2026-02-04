<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\ListInitiativeTranslations;

use App\Modules\Initiatives\Application\Dtos\InitiativeTranslationDto;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeTranslationRepository;

final class ListInitiativeTranslations
{
    public function __construct(
        private readonly IInitiativeTranslationRepository $translations,
    ) {
    }

    /**
     * @return array<int,InitiativeTranslationDto>
     */
    public function handle(Initiative $initiative): array
    {
        return $this->translations
            ->listByInitiative($initiative)
            ->map(static fn($translation): InitiativeTranslationDto => InitiativeTranslationDto::fromModel($translation))
            ->all();
    }
}
