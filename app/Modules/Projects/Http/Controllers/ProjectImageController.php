<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Controllers;

use App\Modules\Shared\Abstractions\Base\Controller;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Application\Services\ProjectImageService;
use App\Modules\Projects\Http\Requests\ProjectImage\StoreProjectImageRequest;
use App\Modules\Projects\Http\Requests\ProjectImage\UpdateProjectImageRequest;
use App\Modules\Images\Domain\Models\Image;

use Illuminate\Http\RedirectResponse;

/**
 * HTTP controller for managing images associated with a specific project.
 *
 * This controller exposes granular endpoints for adding, updating
 * and removing images from a project, delegating storage and
 * persistence concerns to the ImageService.
 */
class ProjectImageController extends Controller
{
    public function __construct(
        private readonly ProjectImageService $imageService,
    ) {
    }

    /**
     * Attach a new image to the given project.
     */
    public function store(
        StoreProjectImageRequest $request,
        Project $project
    ): RedirectResponse {
        $data = $request->validated();

        $this->imageService->add($project, $data);

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Image successfully added to project.');
    }

    /**
     * Update an existing image associated with the given project.
     */
    public function update(
        UpdateProjectImageRequest $request,
        Project $project,
        Image $image
    ): RedirectResponse {
        $this->assertImageBelongsToProject($project, $image);

        $data = $request->validated();

        $this->imageService->update($project, $image, $data);

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Project image successfully updated.');
    }

    /**
     * Detach an image from the given project and delete it when it becomes orphaned.
     */
    public function destroy(Project $project, Image $image): RedirectResponse
    {
        $this->assertImageBelongsToProject($project, $image);

        $this->imageService->detach($project, $image);

        return redirect()
            ->route('projects.edit', $project)
            ->with('status', 'Project image successfully deleted.');
    }

    /**
     * Ensure that the given image is associated with the given project.
     */
    private function assertImageBelongsToProject(Project $project, Image $image): void
    {
        $exists = $project
            ->images()
            ->whereKey($image->id)
            ->exists();

        if (!$exists) {
            abort(404);
        }
    }
}
