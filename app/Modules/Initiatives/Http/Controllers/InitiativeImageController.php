<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Controllers;

use App\Modules\Images\Domain\Models\Image;
use App\Modules\Initiatives\Application\Services\InitiativeImageService;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Http\RedirectResponse;

class InitiativeImageController extends Controller
{
    public function __construct(
        private readonly InitiativeImageService $imageService,
    ) {
    }

    public function destroy(Initiative $initiative, Image $image): RedirectResponse
    {
        $this->assertImageBelongsToInitiative($initiative, $image);

        $this->imageService->detach($initiative, $image);

        return redirect()
            ->route('initiatives.edit', $initiative)
            ->with('status', 'Initiative image successfully deleted.');
    }

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

