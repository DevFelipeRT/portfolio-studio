<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\UpdateInitiativeTranslation;

final class UpdateInitiativeTranslationInput
{
    public function __construct(
        public readonly int $initiativeId,
        public readonly string $locale,
        public readonly ?string $name,
        public readonly ?string $summary,
        public readonly ?string $description,
    ) {
    }
}
