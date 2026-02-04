<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\DeleteInitiativeTranslation;

use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeTranslationRepository;
use InvalidArgumentException;

final class DeleteInitiativeTranslation
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly IInitiativeTranslationRepository $translations,
    ) {
    }

    public function handle(int $initiativeId, string $locale): void
    {
        $initiative = $this->initiatives->findById($initiativeId);

        $existing = $this->translations->findByInitiativeAndLocale($initiative, $locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Initiative translation not found for this locale.');
        }

        $this->translations->delete($existing);
    }
}
