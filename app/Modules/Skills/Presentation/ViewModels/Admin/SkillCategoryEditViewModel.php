<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillCategoryEditViewModel
{
    /**
     * @param array<string,mixed> $category
     * @param array<string,mixed> $initial
     */
    public function __construct(
        public array $category,
        public array $initial,
    ) {
    }

    /**
     * @return array{
     *     category:array<string,mixed>,
     *     initial:array<string,mixed>
     * }
     */
    public function toProps(): array
    {
        return [
            'category' => $this->category,
            'initial' => $this->initial,
        ];
    }
}
