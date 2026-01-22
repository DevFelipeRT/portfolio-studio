<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Application\Services\SkillService;
use App\Modules\Skills\Application\Services\SkillCategoryService;
use App\Modules\Skills\Http\Requests\Skill\StoreSkillRequest;
use App\Modules\Skills\Http\Requests\Skill\UpdateSkillRequest;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing skills in the admin area.
 */
class SkillController extends Controller
{
    public function __construct(
        private readonly SkillService $skillService,
        private readonly SkillCategoryService $skillCategoryService,
    ) {}

    /**
     * Display a listing of skills.
     */
    public function index(): Response
    {
        $skills = $this->skillService->all();

        return Inertia::render('Skills/Pages/Index', [
            'skills' => $skills,
        ]);
    }

    /**
     * Show the form for creating a new skill.
     */
    public function create(): Response
    {
        return Inertia::render('Skills/Pages/Create', [
            'categories' => $this->skillCategoryService->all(),
        ]);
    }

    /**
     * Store a newly created skill in storage.
     */
    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->skillService->create(
            $data['name'],
            $data['skill_category_id'] ?? null,
        );

        return redirect()
            ->route('skills.index')
            ->with('status', 'Skill successfully created.');
    }

    /**
     * Show the form for editing the specified skill.
     */
    public function edit(Skill $skill): Response
    {
        return Inertia::render('Skills/Pages/Edit', [
            'skill' => $skill,
            'categories' => $this->skillCategoryService->all(),
        ]);
    }

    /**
     * Update the specified skill in storage.
     */
    public function update(
        UpdateSkillRequest $request,
        Skill $skill,
    ): RedirectResponse {
        $data = $request->validated();

        $this->skillService->rename(
            $skill,
            $data['name'],
            $data['skill_category_id'] ?? null,
        );

        return redirect()
            ->route('skills.index', $skill)
            ->with('status', 'Skill successfully updated.');
    }

    /**
     * Remove the specified skill from storage.
     */
    public function destroy(Skill $skill): RedirectResponse
    {
        $this->skillService->delete($skill);

        return redirect()
            ->route('skills.index')
            ->with('status', 'Skill successfully deleted.');
    }
}
