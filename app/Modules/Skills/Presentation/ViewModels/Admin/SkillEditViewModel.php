<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillEditViewModel
{
    /**
     * @param array<string,mixed> $skill
     * @param array<int,array<string,mixed>> $categories
     * @param array<string,mixed> $initial
     */
    public function __construct(
        public array $skill,
        public array $categories,
        public array $initial,
    ) {
    }

    /**
     * @return array{
     *     skill:array<string,mixed>,
     *     categories:array<int,array<string,mixed>>,
     *     initial:array<string,mixed>
     * }
     */
    public function toProps(): array
    {
        return [
            'skill' => $this->skill,
            'categories' => $this->categories,
            'initial' => $this->initial,
        ];
    }
}
