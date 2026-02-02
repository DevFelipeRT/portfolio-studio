<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Application\UseCases\CreateSkillCategory\CreateSkillCategory;
use App\Modules\Skills\Application\UseCases\DeleteSkillCategory\DeleteSkillCategory;
use App\Modules\Skills\Application\UseCases\ListSkillCategories\ListSkillCategories;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategory\UpdateSkillCategory;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Http\Mappers\SkillCategoryInputMapper;
use App\Modules\Skills\Http\Requests\SkillCategory\StoreSkillCategoryRequest;
use App\Modules\Skills\Http\Requests\SkillCategory\UpdateSkillCategoryRequest;
use App\Modules\Skills\Presentation\Mappers\SkillCategoryMapper;
use Illuminate\Http\RedirectResponse;
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
        private readonly SkillTranslationResolver $translationResolver,
    ) {}

    /**
     * Display a listing of categories.
     */
    public function index(): Response
    {
        $categories = $this->listSkillCategories->handle();

        return Inertia::render('Skills/Pages/SkillCategories/Index', [
            'categories' => SkillCategoryMapper::collection($categories),
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
        $skillCategory->loadMissing('translations');

        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $name = $this->translationResolver->resolveCategoryName(
            $skillCategory,
            $locale,
            $fallbackLocale,
        );

        $categoryDto = SkillCategoryDto::fromModel($skillCategory, $name);

        return Inertia::render('Skills/Pages/SkillCategories/Edit', [
            'category' => SkillCategoryMapper::map($categoryDto),
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(
        UpdateSkillCategoryRequest $request,
        SkillCategory $skillCategory,
    ): RedirectResponse {
        $input = SkillCategoryInputMapper::fromUpdateRequest($request, $skillCategory);

        $this->updateSkillCategory->handle($skillCategory, $input);

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully updated.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(SkillCategory $skillCategory): RedirectResponse
    {
        $this->deleteSkillCategory->handle($skillCategory);

        return redirect()
            ->route('skill-categories.index')
            ->with('status', 'Skill category successfully deleted.');
    }
}
