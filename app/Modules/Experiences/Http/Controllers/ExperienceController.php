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
use App\Modules\Experiences\Http\Mappers\ExperienceFormMapper;
use App\Modules\Experiences\Http\Mappers\ExperienceInputMapper;
use App\Modules\Experiences\Presentation\Mappers\ExperienceMapper;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing experiences via Inertia.
 */
class ExperienceController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'position',
        'company',
        'start_date',
        'display',
    ];

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
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', '15');
        $search = $this->resolveSearch($request->query('search'));
        $visibility = $this->resolveVisibilityFilter($request->query('visibility'));
        $sort = $this->resolveTableSort($request->query('sort'), self::SORTABLE_COLUMNS);
        $direction = $this->resolveTableDirection($request->query('direction'), $sort);
        $experiences = $this->listExperiences->handle(
            $perPage,
            $search,
            $visibility,
            $sort,
            $direction,
        );

        return Inertia::render('experiences/admin/Index', [
            'experiences' => $this->mapPaginatedResource($experiences, ExperienceMapper::class),
            'filters' => [
                'per_page' => $perPage,
                'search' => $search,
                'visibility' => $visibility,
                'sort' => $sort,
                'direction' => $direction,
            ],
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
    public function edit(Request $request, Experience $experience): Response
    {
        $experienceData = ExperienceMapper::toArray($experience);
        $initial = ExperienceFormMapper::fromEdit($experienceData, []);

        return Inertia::render('experiences/admin/Edit', [
            'experience' => $experienceData,
            'initial' => $initial,
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

    private function resolveSearch(mixed $rawSearch): ?string
    {
        if (!is_string($rawSearch)) {
            return null;
        }

        $search = trim($rawSearch);

        return $search === '' ? null : $search;
    }

    private function resolveVisibilityFilter(mixed $rawVisibility): ?string
    {
        if (!is_string($rawVisibility)) {
            return null;
        }

        return match (trim($rawVisibility)) {
            'public', 'private' => trim($rawVisibility),
            default => null,
        };
    }

}
