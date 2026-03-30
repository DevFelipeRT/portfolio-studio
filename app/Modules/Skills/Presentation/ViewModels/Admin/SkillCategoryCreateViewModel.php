<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillCategoryCreateViewModel
{
    /**
     * @param array<string,mixed> $initial
     */
    public function __construct(
        public array $initial,
    ) {
    }

    /**
     * @return array{initial:array<string,mixed>}
     */
    public function toProps(): array
    {
        return [
            'initial' => $this->initial,
        ];
    }
}
