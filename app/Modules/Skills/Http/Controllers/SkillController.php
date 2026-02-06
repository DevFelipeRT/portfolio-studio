<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Application\UseCases\CreateSkill\CreateSkill;
use App\Modules\Skills\Application\UseCases\DeleteSkill\DeleteSkill;
use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategories;
use App\Modules\Skills\Application\UseCases\ListSkills\ListSkills;
use App\Modules\Skills\Application\UseCases\UpdateSkill\UpdateSkill;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Http\Mappers\SkillInputMapper;
use App\Modules\Skills\Http\Requests\Skill\StoreSkillRequest;
use App\Modules\Skills\Http\Requests\Skill\UpdateSkillRequest;
use App\Modules\Skills\Presentation\Mappers\SkillCategoryMapper;
use App\Modules\Skills\Presentation\Mappers\SkillMapper;

use Illuminate\Http\RedirectResponse;
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
    ) {}

    /**
     * Display a listing of skills.
     */
    public function index(): Response
    {
        $skills = $this->listSkills->handle();
        $categories = $this->listSkillCategories->handle();

        return Inertia::render('Skills/Pages/Index', [
            'skills' => SkillMapper::collection($skills),
            'categories' => SkillCategoryMapper::collection($categories),
        ]);
    }

    /**
     * Show the form for creating a new skill.
     */
    public function create(): Response
    {
        $categories = $this->listSkillCategories->handle();

        return Inertia::render('Skills/Pages/Create', [
            'categories' => SkillCategoryMapper::collection($categories),
        ]);
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
        $categories = $this->listSkillCategories->handle();

        $categoryDto = null;
        if ($skill->category !== null) {
            $categoryDto = SkillCategoryDto::fromModel($skill->category);
        }

        $skillDto = SkillDto::fromModel($skill, null, $categoryDto);

        return Inertia::render('Skills/Pages/Edit', [
            'skill' => SkillMapper::map($skillDto),
            'categories' => SkillCategoryMapper::collection($categories),
        ]);
    }

    /**
     * Update the specified skill in storage.
     */
    public function update(
        UpdateSkillRequest $request,
        Skill $skill,
    ): RedirectResponse {
        $input = SkillInputMapper::fromUpdateRequest($request, $skill);

        $this->updateSkill->handle($skill, $input);

        return redirect()
            ->route('skills.index', $skill)
            ->with('status', 'Skill successfully updated.');
    }

    /**
     * Remove the specified skill from storage.
     */
    public function destroy(Skill $skill): RedirectResponse
    {
        $this->deleteSkill->handle($skill);

        return redirect()
            ->route('skills.index')
            ->with('status', 'Skill successfully deleted.');
    }
}
