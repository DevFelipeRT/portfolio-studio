<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Application\UseCases\CreateProject\CreateProject;
use App\Modules\Projects\Application\UseCases\DeleteProject\DeleteProject;
use App\Modules\Projects\Application\UseCases\ListProjects\ListProjects;
use App\Modules\Projects\Application\UseCases\UpdateProject\UpdateProject;
use App\Modules\Projects\Application\Capabilities\CapabilitiesGateway;
use App\Modules\Projects\Http\Requests\Project\StoreProjectRequest;
use App\Modules\Projects\Http\Requests\Project\UpdateProjectRequest;
use App\Modules\Projects\Http\Mappers\ProjectInputMapper;
use App\Modules\Projects\Presentation\Mappers\ProjectMapper;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing portfolio projects in the admin area.
 */
class ProjectController extends Controller
{
    public function __construct(
        private readonly ListProjects $listProjects,
        private readonly CreateProject $createProject,
        private readonly UpdateProject $updateProject,
        private readonly DeleteProject $deleteProject,
        private readonly CapabilitiesGateway $capabilitiesGateway,
    ) {
    }

    /**
     * Display a listing of projects for the admin area.
     */
    public function index(): Response
    {
        $projects = $this->listProjects->handle();

        return Inertia::render('Projects/Pages/Index', [
            'projects' => ProjectMapper::collection($projects),
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $skills = $this->capabilitiesGateway->resolve('skills.list.v1');

        return Inertia::render('Projects/Pages/Create', [
            'skills' => is_array($skills) ? $skills : [],
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $input = ProjectInputMapper::fromStoreRequest($request);
        $project = $this->createProject->handle($input);

        return redirect()
            ->route('projects.index', $project)
            ->with('status', 'Project successfully created.');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project): Response
    {
        $project->load(['images', 'skills.category', 'translations']);

        $skills = $this->capabilitiesGateway->resolve('skills.list.v1');

        return Inertia::render('Projects/Pages/Edit', [
            'project' => ProjectMapper::toArray($project),
            'skills' => is_array($skills) ? $skills : [],
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $input = ProjectInputMapper::fromUpdateRequest($request, $project);
        $this->updateProject->handle($project, $input);

        return redirect()
            ->route('projects.index', $project)
            ->with('status', 'Project successfully updated.');
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->deleteProject->handle($project);

        return redirect()
            ->route('projects.index')
            ->with('status', 'Project successfully deleted.');
    }
}
