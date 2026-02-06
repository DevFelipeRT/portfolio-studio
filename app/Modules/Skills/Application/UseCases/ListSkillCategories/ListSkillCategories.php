<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategories;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class ListSkillCategories
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
    ) {
    }

    /**
     * @return array<int,SkillCategoryDto>
     */
    public function handle(): array
    {
        $categories = $this->repository->allOrdered();

        return $categories
            ->map(static fn($category): SkillCategoryDto => SkillCategoryDto::fromModel($category))
            ->all();
    }
}
