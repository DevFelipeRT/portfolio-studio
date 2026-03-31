<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\UseCases\CreateSkill\CreateSkill;
use App\Modules\Skills\Application\UseCases\DeleteSkill\DeleteSkillInput;
use App\Modules\Skills\Application\UseCases\DeleteSkill\DeleteSkill;
use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategories;
use App\Modules\Skills\Application\UseCases\ListSkills\ListSkills;
use App\Modules\Skills\Application\UseCases\UpdateSkill\UpdateSkill;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Http\Mappers\ListSkillsInputMapper;
use App\Modules\Skills\Http\Mappers\SkillInputMapper;
use App\Modules\Skills\Http\Requests\Skill\StoreSkillRequest;
use App\Modules\Skills\Http\Requests\Skill\UpdateSkillRequest;
use App\Modules\Skills\Presentation\Presenters\SkillPagePresenter;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing skills in the admin area.
 */
class SkillController extends Controller
{
    public function __construct(
        private readonly ListSkills $listSkills,
        private readonly ListSkillCategories $listSkillCategories,
        private readonly CreateSkill $createSkill,
        private readonly UpdateSkill $updateSkill,
        private readonly DeleteSkill $deleteSkill,
        private readonly ListSkillsInputMapper $listSkillsInputMapper,
        private readonly SkillPagePresenter $skillPagePresenter,
    ) {}

    /**
     * Display a listing of skills.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $input = $this->listSkillsInputMapper->fromRequest($request);
        $skills = $this->listSkills->handle($input);

        if ($skills->shouldClampPage()) {
            return redirect()->route(
                'skills.index',
                $this->buildIndexQueryParams(
                    perPage: $input->perPage,
                    search: $input->search,
                    categoryId: $input->categoryId,
                    sort: $input->sort,
                    direction: $input->direction,
                    page: $skills->lastPage,
                ),
            );
        }

        $categories = $this->listSkillCategories->all();
        $viewModel = $this->skillPagePresenter->buildIndexViewModel(
            skills: $skills,
            categories: $categories,
            filters: [
                'per_page' => $input->perPage,
                'search' => $input->search,
                'category' => $input->categoryId,
                'sort' => $input->sort,
                'direction' => $input->direction,
            ],
        );

        return Inertia::render('skills/admin/Index', $viewModel->toProps());
    }

    /**
     * Show the form for creating a new skill.
     */
    public function create(): Response
    {
        $categories = $this->listSkillCategories->all();
        $viewModel = $this->skillPagePresenter->buildCreateViewModel($categories);

        return Inertia::render('skills/admin/Create', $viewModel->toProps());
    }

    /**
     * Store a newly created skill in storage.
     */
    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $input = SkillInputMapper::fromStoreRequest($request);

        $this->createSkill->handle($input);

        return redirect()
            ->route('skills.index')
            ->with('status', 'Skill successfully created.');
    }

    /**
     * Show the form for editing the specified skill.
     */
    public function edit(Skill $skill): Response
    {
        $skill->loadMissing('category');
        $categories = $this->listSkillCategories->all();
        $viewModel = $this->skillPagePresenter->buildEditViewModel(
            skill: $skill,
            categories: $categories,
        );

        return Inertia::render('skills/admin/Edit', $viewModel->toProps());
    }

    /**
     * Update the specified skill in storage.
     */
    public function update(
        UpdateSkillRequest $request,
        Skill $skill,
    ): RedirectResponse {
        $input = SkillInputMapper::fromUpdateRequest($request, $skill);

        $this->updateSkill->handle($input);

        return redirect()
            ->route('skills.index')
            ->with('status', 'Skill successfully updated.');
    }

    /**
     * Remove the specified skill from storage.
     */
    public function destroy(Request $request, Skill $skill): RedirectResponse
    {
        $this->deleteSkill->handle(new DeleteSkillInput(
            skillId: $skill->id,
        ));

        return redirect()
            ->route(
                'skills.index',
                $this->buildIndexQueryParamsFromRequest($request),
            )
            ->with('status', 'Skill successfully deleted.');
    }

    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParams(
        int $perPage,
        ?string $search,
        ?int $categoryId,
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

        if ($categoryId !== null) {
            $query['category'] = $categoryId;
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
        $input = $this->listSkillsInputMapper->fromRequest($request);

        return $this->buildIndexQueryParams(
            perPage: $input->perPage,
            search: $input->search,
            categoryId: $input->categoryId,
            sort: $input->sort,
            direction: $input->direction,
            page: $input->page,
        );
    }

}
