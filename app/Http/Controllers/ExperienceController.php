<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Experience\StoreExperienceRequest;
use App\Http\Requests\Experience\UpdateExperienceRequest;
use App\Models\Experience;
use App\Services\ExperienceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing experiences via Inertia.
 */
class ExperienceController extends Controller
{
    /**
     * Experience application service.
     */
    private ExperienceService $experienceService;

    /**
     * Create a new controller instance.
     */
    public function __construct(ExperienceService $experienceService)
    {
        $this->experienceService = $experienceService;
    }

    /**
     * Display a listing of the experiences.
     */
    public function index(): Response
    {
        $experiences = $this->experienceService->all();

        return Inertia::render('Experiences/Index', [
            'experiences' => $experiences,
        ]);
    }

    /**
     * Show the form for creating a new experience.
     */
    public function create(): Response
    {
        return Inertia::render('Experiences/Create');
    }

    /**
     * Store a newly created experience in storage.
     */
    public function store(StoreExperienceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->experienceService->create($data);

        return redirect()
            ->route('experiences.index')
            ->with('status', 'Experience successfully created.');
    }

    /**
     * Show the form for editing the specified experience.
     */
    public function edit(Experience $experience): Response
    {
        return Inertia::render('Experiences/Edit', [
            'experience' => $experience,
        ]);
    }

    /**
     * Update the specified experience in storage.
     */
    public function update(
        UpdateExperienceRequest $request,
        Experience $experience
    ): RedirectResponse {
        $data = $request->validated();

        $this->experienceService->update($experience, $data);

        return redirect()
            ->route('experiences.index')
            ->with('status', 'Experience successfully updated.');
    }

    /**
     * Remove the specified experience from storage.
     */
    public function destroy(Experience $experience): RedirectResponse
    {
        $this->experienceService->delete($experience);

        return redirect()
            ->route('experiences.index')
            ->with('status', 'Experience successfully deleted.');
    }
}
