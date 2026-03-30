<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategories;

final readonly class ListSkillCategoriesInput
{
    public function __construct(
        public int $perPage = 15,
        public int $page = 1,
        public ?string $search = null,
        public ?string $sort = null,
        public ?string $direction = null,
    ) {
    }
}
