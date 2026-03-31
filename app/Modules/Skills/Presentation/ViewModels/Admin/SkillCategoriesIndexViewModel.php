<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillCategoriesIndexViewModel
{
    /**
     * @param array{
     *     data:array<int,array<string,mixed>>,
     *     current_page:int,
     *     last_page:int,
     *     per_page:int,
     *     from:?int,
     *     to:?int,
     *     total:int,
     *     path:string,
     *     links:array<int,array{url:string|null,label:string,active:bool}>
     * } $categories
     * @param array<string,mixed> $filters
     */
    public function __construct(
        public array $categories,
        public array $filters,
    ) {
    }

    /**
     * @return array{
     *     categories:array<string,mixed>,
     *     filters:array<string,mixed>
     * }
     */
    public function toProps(): array
    {
        return [
            'categories' => $this->categories,
            'filters' => $this->filters,
        ];
    }
}
