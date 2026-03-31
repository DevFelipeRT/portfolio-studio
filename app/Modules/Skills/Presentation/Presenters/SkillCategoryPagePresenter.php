<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\Presenters;

use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategoriesOutput;
use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategoryItem;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoriesIndexViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoryCreateViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoryEditViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoryFormViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoryViewModel;

final class SkillCategoryPagePresenter
{
    /**
     * @param array<string,mixed> $filters
     */
    public function buildIndexViewModel(
        ListSkillCategoriesOutput $categories,
        array $filters,
    ): SkillCategoriesIndexViewModel {
        return new SkillCategoriesIndexViewModel(
            categories: $this->presentPaginatedCategories($categories),
            filters: $filters,
        );
    }

    /**
     * @param array<string,mixed> $oldInput
     */
    public function buildCreateViewModel(
        array $oldInput = [],
    ): SkillCategoryCreateViewModel {
        return new SkillCategoryCreateViewModel(
            initial: SkillCategoryFormViewModel::empty($oldInput)->toArray(),
        );
    }

    /**
     * @param array<string,mixed> $oldInput
     */
    public function buildEditViewModel(
        SkillCategory $category,
        array $oldInput = [],
    ): SkillCategoryEditViewModel {
        $categoryViewModel = SkillCategoryViewModel::fromModel($category);

        return new SkillCategoryEditViewModel(
            category: $categoryViewModel->toArray(),
            initial: SkillCategoryFormViewModel::fromCategory(
                $categoryViewModel,
                $oldInput,
            )->toArray(),
        );
    }

    /**
     * @return array{
     *     data:array<int,array<string,mixed>>,
     *     current_page:int,
     *     last_page:int,
     *     per_page:int,
     *     from:?int,
     *     to:?int,
     *     total:int,
     *     path:string,
     *     links:array<int,array{url:string|null,label:string,active:bool}>
     * }
     */
    private function presentPaginatedCategories(
        ListSkillCategoriesOutput $categories,
    ): array {
        return [
            'data' => array_map(
                static fn(ListSkillCategoryItem $item): array => SkillCategoryViewModel::fromListItem($item)->toArray(),
                $categories->items,
            ),
            'current_page' => $categories->currentPage,
            'last_page' => $categories->lastPage,
            'per_page' => $categories->perPage,
            'from' => $categories->from,
            'to' => $categories->to,
            'total' => $categories->total,
            'path' => $categories->path,
            'links' => $categories->links,
        ];
    }
}
