<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Application\UseCases\CreateExperience\CreateExperience;
use App\Modules\Experiences\Application\UseCases\DeleteExperience\DeleteExperience;
use App\Modules\Experiences\Application\UseCases\ListExperiences\ListExperiences;
use App\Modules\Experiences\Application\UseCases\UpdateExperience\UpdateExperience;
use App\Modules\Experiences\Http\Requests\Experience\StoreExperienceRequest;
use App\Modules\Experiences\Http\Requests\Experience\UpdateExperienceRequest;
use App\Modules\Experiences\Http\Mappers\ExperienceInputMapper;
use App\Modules\Experiences\Presentation\Mappers\ExperienceMapper;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing experiences via Inertia.
 */
class ExperienceController extends Controller
{
    public function __construct(
        private readonly ListExperiences $listExperiences,
        private readonly CreateExperience $createExperience,
        private readonly UpdateExperience $updateExperience,
        private readonly DeleteExperience $deleteExperience,
    ) {
    }

    /**
     * Display a listing of the experiences.
     */
    public function index(): Response
    {
        $experiences = $this->listExperiences->handle();

        return Inertia::render('experiences/admin/Index', [
            'experiences' => ExperienceMapper::collection($experiences),
        ]);
    }

    /**
     * Show the form for creating a new experience.
     */
    public function create(): Response
    {
        return Inertia::render('experiences/admin/Create');
    }

    /**
     * Store a newly created experience in storage.
     */
    public function store(StoreExperienceRequest $request): RedirectResponse
    {
        $input = ExperienceInputMapper::fromStoreRequest($request);
        $this->createExperience->handle($input);

        return redirect()
            ->route('experiences.index')
            ->with('status', 'Experience successfully created.');
    }

    /**
     * Show the form for editing the specified experience.
     */
    public function edit(Experience $experience): Response
    {
        return Inertia::render('experiences/admin/Edit', [
            'experience' => ExperienceMapper::toArray($experience),
        ]);
    }

    /**
     * Update the specified experience in storage.
     */
    public function update(
        UpdateExperienceRequest $request,
        Experience $experience
    ): RedirectResponse {
        $input = ExperienceInputMapper::fromUpdateRequest($request, $experience);
        $this->updateExperience->handle($experience, $input);

        return redirect()
            ->route('experiences.index')
            ->with('status', 'Experience successfully updated.');
    }

    /**
     * Remove the specified experience from storage.
     */
    public function destroy(Experience $experience): RedirectResponse
    {
        $this->deleteExperience->handle($experience);

        return redirect()
            ->route('experiences.index')
            ->with('status', 'Experience successfully deleted.');
    }
}
