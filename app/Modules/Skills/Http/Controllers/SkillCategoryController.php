<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\Services\SkillCategoryService;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Http\Requests\SkillCategory\StoreSkillCategoryRequest;
use App\Modules\Skills\Http\Requests\SkillCategory\UpdateSkillCategoryRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing skill categories in the admin area.
 */
class SkillCategoryController extends Controller
{
    public function __construct(
        private readonly SkillCategoryService $skillCategoryService,
    ) {}

    /**
     * Display a listing of categories.
     */
    public function index(): Response
    {
        $categories = $this->skillCategoryService->all();

        return Inertia::render('Skills/Pages/SkillCategories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Skills/Pages/SkillCategories/Create');
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(StoreSkillCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->skillCategoryService->create(
            $data['name'],
            $data['slug'] ?? null,
        );

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully created.');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(SkillCategory $skillCategory): Response
    {
        return Inertia::render('Skills/Pages/SkillCategories/Edit', [
            'category' => $skillCategory,
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(
        UpdateSkillCategoryRequest $request,
        SkillCategory $skillCategory,
    ): RedirectResponse {
        $data = $request->validated();

        $this->skillCategoryService->update(
            $skillCategory,
            $data['name'],
            $data['slug'] ?? null,
        );

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully updated.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(SkillCategory $skillCategory): RedirectResponse
    {
        $this->skillCategoryService->delete($skillCategory);

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully deleted.');
    }
}
