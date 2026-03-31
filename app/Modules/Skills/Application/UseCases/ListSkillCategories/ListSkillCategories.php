<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillCategories;

use App\Modules\Skills\Application\Mappers\SkillAdminOutputMapper;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;
use App\Modules\Skills\Domain\Models\SkillCategory;

final class ListSkillCategories
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
        private readonly SkillAdminOutputMapper $skillAdminOutputMapper,
    ) {
    }

    public function handle(ListSkillCategoriesInput $input): ListSkillCategoriesOutput
    {
        $categories = $this->repository->paginateOrdered(
            perPage: $input->perPage,
            page: $input->page,
            search: $input->search,
            sort: $input->sort,
            direction: $input->direction,
        );

        return new ListSkillCategoriesOutput(
            items: array_map(
                fn(SkillCategory $category): ListSkillCategoryItem => $this->skillAdminOutputMapper->toListSkillCategoryItem($category),
                $categories->items(),
            ),
            currentPage: $categories->currentPage(),
            lastPage: $categories->lastPage(),
            perPage: $categories->perPage(),
            from: $categories->firstItem(),
            to: $categories->lastItem(),
            total: $categories->total(),
            path: $categories->path(),
            links: $categories->linkCollection()
                ->map(static fn(array $link): array => [
                    'url' => $link['url'],
                    'label' => (string) $link['label'],
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
        );
    }

    /**
     * @return array<int,ListSkillCategoryItem>
     */
    public function all(): array
    {
        $categories = $this->repository->allOrdered();

        return $categories
            ->map(fn($category): ListSkillCategoryItem => $this->skillAdminOutputMapper->toListSkillCategoryItem($category))
            ->all();
    }
}
