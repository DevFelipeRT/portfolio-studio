<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillCreateViewModel
{
    /**
     * @param array<int,array<string,mixed>> $categories
     * @param array<string,mixed> $initial
     */
    public function __construct(
        public array $categories,
        public array $initial,
    ) {
    }

    /**
     * @return array{
     *     categories:array<int,array<string,mixed>>,
     *     initial:array<string,mixed>
     * }
     */
    public function toProps(): array
    {
        return [
            'categories' => $this->categories,
            'initial' => $this->initial,
        ];
    }
}
