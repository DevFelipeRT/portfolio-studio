<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations;

final readonly class ListSkillCategoryTranslationsOutput
{
    /**
     * @param array<int,ListSkillCategoryTranslationItem> $items
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
            static fn(ListSkillCategoryTranslationItem $item): array => $item->toArray(),
            $this->items,
        );
    }
}
