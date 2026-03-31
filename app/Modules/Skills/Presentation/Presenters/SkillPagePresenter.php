<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\Presenters;

use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategoryItem;
use App\Modules\Skills\Application\UseCases\ListSkills\ListSkillItem;
use App\Modules\Skills\Application\UseCases\ListSkills\ListSkillsOutput;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoryViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCreateViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillEditViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillFormViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillsIndexViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillViewModel;

final class SkillPagePresenter
{
    /**
     * @param array<int,ListSkillCategoryItem> $categories
     * @param array<string,mixed> $filters
     */
    public function buildIndexViewModel(
        ListSkillsOutput $skills,
        array $categories,
        array $filters,
    ): SkillsIndexViewModel {
        return new SkillsIndexViewModel(
            skills: $this->presentPaginatedSkills($skills),
            categories: $this->presentCategories($categories),
            filters: $filters,
        );
    }

    /**
     * @param array<int,ListSkillCategoryItem> $categories
     * @param array<string,mixed> $oldInput
     */
    public function buildCreateViewModel(
        array $categories,
        array $oldInput = [],
    ): SkillCreateViewModel {
        return new SkillCreateViewModel(
            categories: $this->presentCategories($categories),
            initial: SkillFormViewModel::empty($oldInput)->toArray(),
        );
    }

    /**
     * @param array<int,ListSkillCategoryItem> $categories
     * @param array<string,mixed> $oldInput
     */
    public function buildEditViewModel(
        Skill $skill,
        array $categories,
        array $oldInput = [],
    ): SkillEditViewModel {
        $skillViewModel = SkillViewModel::fromModel($skill);

        return new SkillEditViewModel(
            skill: $skillViewModel->toArray(),
            categories: $this->presentCategories($categories),
            initial: SkillFormViewModel::fromSkill(
                $skillViewModel,
                $oldInput,
            )->toArray(),
        );
    }

    /**
     * @param array<int,ListSkillCategoryItem> $categories
     * @return array<int,array<string,mixed>>
     */
    private function presentCategories(array $categories): array
    {
        return array_map(
            static fn(ListSkillCategoryItem $item): array => SkillCategoryViewModel::fromListItem($item)->toArray(),
            $categories,
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
    private function presentPaginatedSkills(ListSkillsOutput $skills): array
    {
        return [
            'data' => array_map(
                static fn(ListSkillItem $item): array => SkillViewModel::fromListItem($item)->toArray(),
                $skills->items,
            ),
            'current_page' => $skills->currentPage,
            'last_page' => $skills->lastPage,
            'per_page' => $skills->perPage,
            'from' => $skills->from,
            'to' => $skills->to,
            'total' => $skills->total,
            'path' => $skills->path,
            'links' => $skills->links,
        ];
    }
}
