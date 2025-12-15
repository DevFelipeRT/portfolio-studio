<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Application\Services\InitiativeImageService;
use App\Modules\Initiatives\Http\Requests\InitiativeImage\StoreInitiativeImageRequest;
use App\Modules\Initiatives\Http\Requests\InitiativeImage\UpdateInitiativeImageRequest;
use App\Modules\Images\Domain\Models\Image;

use Illuminate\Http\RedirectResponse;

/**
 * HTTP controller for managing images associated with a specific initiative.
 *
 * This controller exposes granular endpoints for adding, updating
 * and removing images from an initiative, delegating storage and
 * persistence concerns to the ImageService.
 */
class InitiativeImageController extends Controller
{
    public function __construct(
        private readonly InitiativeImageService $imageService,
    ) {
    }

    /**
     * Attach a new image to the given initiative.
     */
    public function store(
        StoreInitiativeImageRequest $request,
        Initiative $initiative
    ): RedirectResponse {
        $data = $request->validated();

        $this->imageService->add($initiative, $data);

        return redirect()
            ->route('initiatives.edit', $initiative)
            ->with('success', 'Image successfully added to initiative.');
    }

    /**
     * Update an existing image associated with the given initiative.
     */
    public function update(
        UpdateInitiativeImageRequest $request,
        Initiative $initiative,
        Image $image
    ): RedirectResponse {
        $this->assertImageBelongsToInitiative($initiative, $image);

        $data = $request->validated();

        $this->imageService->update($initiative, $image, $data);

        return redirect()
            ->route('initiatives.edit', $initiative)
            ->with('success', 'Initiative image successfully updated.');
    }

    /**
     * Detach an image from the given initiative and delete it when it becomes orphaned.
     */
    public function destroy(Initiative $initiative, Image $image): RedirectResponse
    {
        $this->assertImageBelongsToInitiative($initiative, $image);

        $this->imageService->detach($initiative, $image);

        return redirect()
            ->route('initiatives.edit', $initiative)
            ->with('success', 'Initiative image successfully deleted.');
    }

    /**
     * Ensure that the given image is associated with the given initiative.
     */
    private function assertImageBelongsToInitiative(Initiative $initiative, Image $image): void
    {
        $exists = $initiative
            ->images()
            ->whereKey($image->id)
            ->exists();

        if (!$exists) {
            abort(404);
        }
    }
}
