<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\UseCases\CreateSkillCategory\CreateSkillCategory;
use App\Modules\Skills\Application\UseCases\DeleteSkillCategory\DeleteSkillCategoryInput;
use App\Modules\Skills\Application\UseCases\DeleteSkillCategory\DeleteSkillCategory;
use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategories;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategory\UpdateSkillCategory;
use App\Modules\Skills\Http\Mappers\ListSkillCategoriesInputMapper;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Http\Mappers\SkillCategoryInputMapper;
use App\Modules\Skills\Http\Requests\SkillCategory\StoreSkillCategoryRequest;
use App\Modules\Skills\Http\Requests\SkillCategory\UpdateSkillCategoryRequest;
use App\Modules\Skills\Presentation\Presenters\SkillCategoryPagePresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing skill categories in the admin area.
 */
class SkillCategoryController extends Controller
{
    public function __construct(
        private readonly ListSkillCategories $listSkillCategories,
        private readonly CreateSkillCategory $createSkillCategory,
        private readonly UpdateSkillCategory $updateSkillCategory,
        private readonly DeleteSkillCategory $deleteSkillCategory,
        private readonly ListSkillCategoriesInputMapper $listSkillCategoriesInputMapper,
        private readonly SkillCategoryPagePresenter $skillCategoryPagePresenter,
    ) {}

    /**
     * Display a listing of categories.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $input = $this->listSkillCategoriesInputMapper->fromRequest($request);
        $categories = $this->listSkillCategories->handle($input);

        if ($categories->shouldClampPage()) {
            return redirect()->route(
                'skill-categories.index',
                $this->buildIndexQueryParams(
                    perPage: $input->perPage,
                    search: $input->search,
                    sort: $input->sort,
                    direction: $input->direction,
                    page: $categories->lastPage,
                ),
            );
        }

        $viewModel = $this->skillCategoryPagePresenter->buildIndexViewModel(
            categories: $categories,
            filters: [
                'per_page' => $input->perPage,
                'search' => $input->search,
                'sort' => $input->sort,
                'direction' => $input->direction,
            ],
        );

        return Inertia::render(
            'skills/admin/skill-categories/Index',
            $viewModel->toProps(),
        );
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        $viewModel = $this->skillCategoryPagePresenter->buildCreateViewModel();

        return Inertia::render(
            'skills/admin/skill-categories/Create',
            $viewModel->toProps(),
        );
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(StoreSkillCategoryRequest $request): RedirectResponse
    {
        $input = SkillCategoryInputMapper::fromStoreRequest($request);

        $this->createSkillCategory->handle($input);

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully created.');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(SkillCategory $skillCategory): Response
    {
        $viewModel = $this->skillCategoryPagePresenter->buildEditViewModel(
            $skillCategory,
        );

        return Inertia::render(
            'skills/admin/skill-categories/Edit',
            $viewModel->toProps(),
        );
    }

    /**
     * Update the specified category in storage.
     */
    public function update(
        UpdateSkillCategoryRequest $request,
        SkillCategory $skillCategory,
    ): RedirectResponse {
        $input = SkillCategoryInputMapper::fromUpdateRequest($request, $skillCategory);

        $this->updateSkillCategory->handle($input);

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully updated.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(
        Request $request,
        SkillCategory $skillCategory,
    ): RedirectResponse
    {
        $this->deleteSkillCategory->handle(new DeleteSkillCategoryInput(
            skillCategoryId: $skillCategory->id,
        ));

        return redirect()
            ->route(
                'skill-categories.index',
                $this->buildIndexQueryParamsFromRequest($request),
            )
            ->with('status', 'Skill category successfully deleted.');
    }

    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParams(
        int $perPage,
        ?string $search,
        ?string $sort,
        ?string $direction,
        int $page,
    ): array {
        $query = [
            'per_page' => $perPage,
        ];

        if ($search !== null) {
            $query['search'] = $search;
        }

        if ($sort !== null) {
            $query['sort'] = $sort;

            if ($direction !== null) {
                $query['direction'] = $direction;
            }
        }

        if ($page > 1) {
            $query['page'] = $page;
        }

        return $query;
    }

    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParamsFromRequest(Request $request): array
    {
        $input = $this->listSkillCategoriesInputMapper->fromRequest($request);

        return $this->buildIndexQueryParams(
            perPage: $input->perPage,
            search: $input->search,
            sort: $input->sort,
            direction: $input->direction,
            page: $input->page,
        );
    }

}
