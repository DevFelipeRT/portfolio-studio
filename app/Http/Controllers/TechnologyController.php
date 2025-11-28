<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\TechnologyCategories;
use App\Http\Requests\StoreTechnologyRequest;
use App\Http\Requests\UpdateTechnologyRequest;
use App\Models\Technology;
use App\Services\TechnologyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing technologies in the admin area.
 */
class TechnologyController extends Controller
{
    public function __construct(
        private readonly TechnologyService $technologyService,
    ) {}

    /**
     * Display a listing of technologies.
     */
    public function index(): Response
    {
        $technologies = $this->technologyService->all();

        return Inertia::render('Technologies/Index', [
            'technologies' => $technologies,
        ]);
    }

    /**
     * Show the form for creating a new technology.
     */
    public function create(): Response
    {
        return Inertia::render('Technologies/Create', [
            'categories' => TechnologyCategories::options(),
        ]);
    }

    /**
     * Store a newly created technology in storage.
     */
    public function store(StoreTechnologyRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $category = TechnologyCategories::from($data['category']);

        $this->technologyService->create(
            $data['name'],
            $category,
        );

        return redirect()
            ->route('technologies.index')
            ->with('status', 'Technology successfully created.');
    }

    /**
     * Show the form for editing the specified technology.
     */
    public function edit(Technology $technology): Response
    {
        return Inertia::render('Technologies/Edit', [
            'technology' => $technology,
            'categories' => TechnologyCategories::options(),
        ]);
    }

    /**
     * Update the specified technology in storage.
     */
    public function update(
        UpdateTechnologyRequest $request,
        Technology $technology,
    ): RedirectResponse {
        $data = $request->validated();

        $category = TechnologyCategories::from($data['category']);

        $this->technologyService->rename(
            $technology,
            $data['name'],
            $category,
        );

        return redirect()
            ->route('technologies.index', $technology)
            ->with('status', 'Technology successfully updated.');
    }

    /**
     * Remove the specified technology from storage.
     */
    public function destroy(Technology $technology): RedirectResponse
    {
        $this->technologyService->delete($technology);

        return redirect()
            ->route('technologies.index')
            ->with('status', 'Technology successfully deleted.');
    }
}
