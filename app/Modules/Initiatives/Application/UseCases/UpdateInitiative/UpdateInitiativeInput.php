<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\UpdateInitiative;

final class UpdateInitiativeInput
{
    /**
     * @param array<int,array<string,mixed>>|null $images
     */
    public function __construct(
        public readonly string $locale,
        public readonly bool $confirmSwap,
        public readonly string $name,
        public readonly string $summary,
        public readonly string $description,
        public readonly bool $display,
        public readonly string $startDate,
        public readonly ?string $endDate,
        public readonly ?array $images = null,
    ) {
    }
}
