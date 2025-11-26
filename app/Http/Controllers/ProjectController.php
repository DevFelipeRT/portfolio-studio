<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Services\ProjectService;
use App\Services\TechnologyService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing portfolio projects in the admin area.
 */
class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
        private readonly TechnologyService $technologyService,
    ) {}

    /**
     * Display a listing of projects for the admin area.
     */
    public function index(): Response
    {
        $projects = $this->projectService->all();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $technologies = $this->technologyService->all();

        return Inertia::render('Projects/Create', [
            'technologies' => $technologies,
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $attributes = [
            'name'              => $data['name'],
            'short_description' => $data['short_description'],
            'long_description'  => $data['long_description'],
            'status'            => $data['status'],
            'repository_url'    => $data['repository_url'] ?? null,
            'live_url'          => $data['live_url'] ?? null,
        ];

        $technologyIds = $data['technology_ids'] ?? [];
        $images        = $data['images'] ?? [];

        $project = $this->projectService->create(
            $attributes,
            $technologyIds,
            $images,
        );

        return redirect()
            ->route('projects.index', $project)
            ->with('status', 'Project successfully created.');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project): Response
    {
        $project->load(['images', 'technologies']);

        $technologies = $this->technologyService->all();

        return Inertia::render('Projects/Edit', [
            'project'      => $project,
            'technologies' => $technologies,
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $data = $request->validated();

        $attributes = [
            'name'              => $data['name'],
            'short_description' => $data['short_description'],
            'long_description'  => $data['long_description'],
            'status'            => $data['status'],
            'repository_url'    => $data['repository_url'] ?? null,
            'live_url'          => $data['live_url'] ?? null,
            'display'           => $data['display'] ?? null,
        ];

        $technologyIds = $data['technology_ids'] ?? [];
        $images        = $data['images'] ?? [];

        $this->projectService->update(
            $project,
            $attributes,
            $technologyIds,
            $images,
        );

        return redirect()
            ->route('projects.index', $project)
            ->with('status', 'Project successfully updated.');
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->projectService->delete($project);

        return redirect()
            ->route('projects.index')
            ->with('status', 'Project successfully deleted.');
    }

    /**
     * Delete a single image that belongs to the given project.
     */
    public function destroyImage(Project $project, ProjectImage $image): RedirectResponse
    {
        if ($image->project_id !== $project->id) {
            abort(404);
        }

        $this->projectService->deleteImage($image);

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Image successfully deleted.');
    }
}
