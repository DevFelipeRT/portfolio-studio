<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Application\UseCases\CreateProject\CreateProject;
use App\Modules\Projects\Application\UseCases\DeleteProject\DeleteProject;
use App\Modules\Projects\Application\UseCases\DeleteProject\DeleteProjectInput;
use App\Modules\Projects\Application\UseCases\GetProjectDetails\GetProjectDetails;
use App\Modules\Projects\Application\UseCases\GetProjectDetails\GetProjectDetailsInput;
use App\Modules\Projects\Application\UseCases\ListProjects\ListProjects;
use App\Modules\Projects\Application\UseCases\UpdateProject\UpdateProject;
use App\Modules\Projects\Application\Capabilities\CapabilitiesGateway;
use App\Modules\Projects\Http\Requests\Project\StoreProjectRequest;
use App\Modules\Projects\Http\Requests\Project\UpdateProjectRequest;
use App\Modules\Projects\Http\Mappers\ProjectFormMapper;
use App\Modules\Projects\Http\Mappers\CreateProjectInputMapper;
use App\Modules\Projects\Http\Mappers\ListProjectsInputMapper;
use App\Modules\Projects\Http\Mappers\UpdateProjectInputMapper;
use App\Modules\Projects\Presentation\Mappers\ProjectMapper;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing portfolio projects in the admin area.
 */
class ProjectController extends Controller
{
    public function __construct(
        private readonly ListProjects $listProjects,
        private readonly GetProjectDetails $getProjectDetails,
        private readonly CreateProject $createProject,
        private readonly UpdateProject $updateProject,
        private readonly DeleteProject $deleteProject,
        private readonly CapabilitiesGateway $capabilitiesGateway,
        private readonly ListProjectsInputMapper $listProjectsInputMapper,
        private readonly CreateProjectInputMapper $createProjectInputMapper,
        private readonly UpdateProjectInputMapper $updateProjectInputMapper,
    ) {
    }

    /**
     * Display a listing of projects for the admin area.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $input = $this->listProjectsInputMapper->fromRequest($request);
        $projects = $this->listProjects->handle($input);

        if ($projects->shouldClampPage()) {
            return redirect()->route(
                'projects.index',
                $this->buildIndexQueryParams(
                    $input->perPage,
                    $input->search,
                    $input->status,
                    $input->visibility,
                    $input->sort,
                    $input->direction,
                    $projects->lastPage,
                ),
            );
        }

        return Inertia::render('projects/admin/Index', [
            'projects' => $projects->toArray(),
            'filters' => [
                'per_page' => $input->perPage,
                'search' => $input->search,
                'status' => $input->status?->toScalar(),
                'visibility' => $input->visibility,
                'sort' => $input->sort,
                'direction' => $input->direction,
            ],
        ]);
    }

    public function details(Project $project): JsonResponse
    {
        return response()->json([
            'data' => $this->getProjectDetails->handle(
                new GetProjectDetailsInput(
                    projectId: $project->id,
                ),
            )->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        $skills = $this->capabilitiesGateway->resolve('skills.list.v1');

        return Inertia::render('projects/admin/Create', [
            'skills' => is_array($skills) ? $skills : [],
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $input = $this->createProjectInputMapper->fromRequest($request);
        $this->createProject->handle($input);

        return redirect()
            ->route('projects.index', [], 303)
            ->with('status', 'Project successfully created.');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Request $request, Project $project): Response
    {
        $project->load(['images', 'skills.category']);

        $skills = $this->capabilitiesGateway->resolve('skills.list.v1');
        $projectData = ProjectMapper::toArray($project);

        return Inertia::render('projects/admin/Edit', [
            'project' => $projectData,
            'skills' => is_array($skills) ? $skills : [],
            'initial' => ProjectFormMapper::fromEdit($projectData, []),
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $input = $this->updateProjectInputMapper->fromRequest($request, $project);
        $this->updateProject->handle($input);

        return redirect()
            ->route('projects.index', [], 303)
            ->with('status', 'Project successfully updated.');
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroy(Request $request, Project $project): RedirectResponse
    {
        $this->deleteProject->handle(
            new DeleteProjectInput(
                projectId: $project->id,
            ),
        );

        $redirect = $request->headers->has('referer')
            ? redirect()->back()
            : redirect()->route('projects.index');

        return $redirect->with('status', 'Project successfully deleted.');
    }
    
    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParams(
        int $perPage,
        ?string $search,
        ?string $status,
        ?string $visibility,
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

        if ($status !== null) {
            $query['status'] = $status;
        }

        if ($visibility !== null) {
            $query['visibility'] = $visibility;
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

}
