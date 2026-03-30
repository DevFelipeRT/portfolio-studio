<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillTranslations;

final readonly class ListSkillTranslationsOutput
{
    /**
     * @param array<int,ListSkillTranslationItem> $items
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
            static fn(ListSkillTranslationItem $item): array => $item->toArray(),
            $this->items,
        );
    }
}
