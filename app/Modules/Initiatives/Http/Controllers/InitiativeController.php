<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Application\UseCases\CreateInitiative\CreateInitiative;
use App\Modules\Initiatives\Application\UseCases\DeleteInitiative\DeleteInitiative;
use App\Modules\Initiatives\Application\UseCases\ListInitiatives\ListInitiatives;
use App\Modules\Initiatives\Application\UseCases\UpdateInitiative\UpdateInitiative;
use App\Modules\Initiatives\Http\Mappers\InitiativeInputMapper;
use App\Modules\Initiatives\Http\Requests\Initiative\StoreInitiativeRequest;
use App\Modules\Initiatives\Http\Requests\Initiative\UpdateInitiativeRequest;
use App\Modules\Initiatives\Presentation\Mappers\InitiativeMapper;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller responsible for managing initiatives through Inertia pages.
 */
class InitiativeController extends Controller
{
    public function __construct(
        private readonly ListInitiatives $listInitiatives,
        private readonly CreateInitiative $createInitiative,
        private readonly UpdateInitiative $updateInitiative,
        private readonly DeleteInitiative $deleteInitiative,
    ) {
    }

    /**
     * Display the list of initiatives.
     */
    public function index(): Response
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();
        $initiatives = $this->listInitiatives->handle($locale, $fallbackLocale);

        return Inertia::render('Initiatives/Pages/Index', [
            'initiatives' => InitiativeMapper::collection($initiatives),
        ]);
    }

    /**
     * Show the form for creating a new initiative.
     */
    public function create(): Response
    {
        return Inertia::render('Initiatives/Pages/Create');
    }

    /**
     * Store a newly created initiative.
     */
    public function store(StoreInitiativeRequest $request): RedirectResponse
    {
        $input = InitiativeInputMapper::fromStoreRequest($request);
        $this->createInitiative->handle($input);

        return redirect()
            ->route('initiatives.index')
            ->with('success', 'Initiative created successfully.');
    }

    /**
     * Show the form for editing an existing initiative.
     */
    public function edit(Initiative $initiative): Response
    {
        $initiative->load(['images']);

        return Inertia::render('Initiatives/Pages/Edit', [
            'initiative' => InitiativeMapper::toArray($initiative),
        ]);
    }

    /**
     * Update an existing initiative.
     */
    public function update(
        UpdateInitiativeRequest $request,
        Initiative $initiative
    ): RedirectResponse {
        $input = InitiativeInputMapper::fromUpdateRequest($request, $initiative);
        $this->updateInitiative->handle($initiative, $input);

        return redirect()
            ->route('initiatives.index')
            ->with('success', 'Initiative updated successfully.');
    }

    /**
     * Remove an initiative.
     */
    public function destroy(Initiative $initiative): RedirectResponse
    {
        $this->deleteInitiative->handle($initiative);

        return redirect()
            ->route('initiatives.index')
            ->with('success', 'Initiative deleted successfully.');
    }

    /**
     * Toggle the display flag for an initiative.
     */
    public function toggleDisplay(Initiative $initiative): RedirectResponse
    {
        $initiative->display = !$initiative->display;
        $initiative->save();

        return redirect()
            ->back()
            ->with('success', 'Initiative display status updated.');
    }
}
