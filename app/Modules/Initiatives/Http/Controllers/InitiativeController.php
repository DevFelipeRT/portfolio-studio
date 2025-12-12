<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Controllers;

use App\Modules\Shared\Abstractions\Base\Controller;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Application\Services\InitiativeService;
use App\Modules\Initiatives\Http\Requests\Initiative\StoreInitiativeRequest;
use App\Modules\Initiatives\Http\Requests\Initiative\UpdateInitiativeRequest;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller responsible for managing initiatives through Inertia pages.
 */
class InitiativeController extends Controller
{
    public function __construct(
        private readonly InitiativeService $initiativeService,
    ) {
    }

    /**
     * Display the list of initiatives.
     */
    public function index(): Response
    {
        $initiatives = $this->initiativeService->listAll();

        return Inertia::render('Initiatives/Index', [
            'initiatives' => $initiatives,
        ]);
    }

    /**
     * Show the form for creating a new initiative.
     */
    public function create(): Response
    {
        return Inertia::render('Initiatives/Create');
    }

    /**
     * Store a newly created initiative.
     */
    public function store(StoreInitiativeRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $images = $data['images'] ?? [];

        unset($data['images']);

        $this->initiativeService->create($data, $images);

        return redirect()
            ->route('initiatives.index')
            ->with('success', 'Initiative created successfully.');
    }

    /**
     * Show the form for editing an existing initiative.
     */
    public function edit(Initiative $initiative): Response
    {
        $initiative->load('images');

        return Inertia::render('Initiatives/Edit', [
            'initiative' => $initiative,
        ]);
    }

    /**
     * Update an existing initiative.
     */
    public function update(
        UpdateInitiativeRequest $request,
        Initiative $initiative
    ): RedirectResponse {
        $data = $request->validated();

        $images = $request->has('images')
            ? (array) ($data['images'] ?? [])
            : null;

        unset($data['images']);

        $this->initiativeService->update($initiative, $data, $images);

        return redirect()
            ->route('initiatives.index')
            ->with('success', 'Initiative updated successfully.');
    }

    /**
     * Remove an initiative.
     */
    public function destroy(Initiative $initiative): RedirectResponse
    {
        $this->initiativeService->delete($initiative);

        return redirect()
            ->route('initiatives.index')
            ->with('success', 'Initiative deleted successfully.');
    }

    /**
     * Toggle the display flag for an initiative.
     */
    public function toggleDisplay(Initiative $initiative): RedirectResponse
    {
        $this->initiativeService->toggleDisplay($initiative);

        return redirect()
            ->back()
            ->with('success', 'Initiative display status updated.');
    }
}
