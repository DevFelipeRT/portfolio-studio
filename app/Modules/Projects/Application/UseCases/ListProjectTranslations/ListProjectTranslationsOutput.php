<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\UseCases\ListProjectTranslations;

final readonly class ListProjectTranslationsOutput
{
    /**
     * @param array<int,ListProjectTranslationItem> $items
     */
    public function __construct(
        public array $items,
    ) {
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function toArray(): array
    {
        return array_map(
            static fn(ListProjectTranslationItem $item): array => $item->toArray(),
            $this->items,
        );
    }
}
