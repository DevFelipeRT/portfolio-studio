<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Controllers;

use App\Modules\Initiatives\Application\UseCases\CreateInitiative\CreateInitiative;
use App\Modules\Initiatives\Application\UseCases\DeleteInitiative\DeleteInitiative;
use App\Modules\Initiatives\Application\UseCases\ListInitiatives\ListInitiatives;
use App\Modules\Initiatives\Application\UseCases\UpdateInitiative\UpdateInitiative;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Http\Mappers\InitiativeFormMapper;
use App\Modules\Initiatives\Http\Mappers\InitiativeInputMapper;
use App\Modules\Initiatives\Http\Requests\Initiative\StoreInitiativeRequest;
use App\Modules\Initiatives\Http\Requests\Initiative\UpdateInitiativeRequest;
use App\Modules\Initiatives\Presentation\Mappers\InitiativeMapper;
use App\Modules\Initiatives\Presentation\Presenters\InitiativeAdminPresenter;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller responsible for managing initiatives through Inertia pages.
 */
class InitiativeController extends Controller
{
    private const SORTABLE_COLUMNS = ['name', 'start_date', 'display', 'image_count'];

    public function __construct(
        private readonly ListInitiatives $listInitiatives,
        private readonly CreateInitiative $createInitiative,
        private readonly UpdateInitiative $updateInitiative,
        private readonly DeleteInitiative $deleteInitiative,
        private readonly InitiativeAdminPresenter $initiativeAdminPresenter,
    ) {
    }

    /**
     * Display the list of initiatives.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();
        $perPage = (int) $request->query('per_page', '15');
        $page = $this->resolvePage($request->query('page'));
        $search = $this->resolveSearch($request->query('search'));
        $displayFilter = $this->resolveDisplayFilter($request->query('display'));
        $hasImages = $this->resolveHasImages($request->query('has_images'));
        $sort = $this->resolveTableSort($request->query('sort'), self::SORTABLE_COLUMNS);
        $direction = $this->resolveTableDirection($request->query('direction'), $sort);
        $result = $this->listInitiatives->handle(
            $locale,
            $fallbackLocale,
            $perPage,
            $page,
            $search,
            $displayFilter,
            $hasImages,
            $sort,
            $direction,
        );
        $initiatives = $result['initiatives'];

        if ($this->shouldClampPage($initiatives)) {
            return redirect()->route(
                'initiatives.index',
                $this->buildIndexQueryParams(
                    $perPage,
                    $search,
                    $displayFilter,
                    $hasImages,
                    $sort,
                    $direction,
                    $initiatives->lastPage(),
                ),
            );
        }

        return Inertia::render('initiatives/admin/Index', [
            'initiatives' => $this->mapPaginatedItems(
                $initiatives,
                fn(Initiative $initiative): array => $this->initiativeAdminPresenter->toListItem(
                    $initiative,
                    $locale,
                    $fallbackLocale,
                ),
            ),
            'filters' => [
                'per_page' => $perPage,
                'search' => $search,
                'display' => $displayFilter,
                'has_images' => $hasImages,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'stats' => [
                'visible_count' => $result['visible_count'],
            ],
        ]);
    }

    public function details(Initiative $initiative): JsonResponse
    {
        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();

        $initiative->load([
            'images',
            'translations' => fn($relation) => $relation->whereIn(
                'locale',
                $this->normalizeLocales($locale, $fallbackLocale),
            ),
        ]);

        return response()->json([
            'data' => $this->initiativeAdminPresenter->toDetail(
                $initiative,
                $locale,
                $fallbackLocale,
            ),
        ]);
    }

    /**
     * Show the form for creating a new initiative.
     */
    public function create(): Response
    {
        return Inertia::render('initiatives/admin/Create');
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
    public function edit(Request $request, Initiative $initiative): Response
    {
        $initiative->load(['images']);

        $initiativeData = InitiativeMapper::toArray($initiative);

        return Inertia::render('initiatives/admin/Edit', [
            'initiative' => $initiativeData,
            'initial' => InitiativeFormMapper::fromEdit($initiativeData, []),
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
    public function destroy(Request $request, Initiative $initiative): RedirectResponse
    {
        $this->deleteInitiative->handle($initiative);

        $redirect = $request->headers->has('referer')
            ? redirect()->back()
            : redirect()->route('initiatives.index');

        return $redirect->with('success', 'Initiative deleted successfully.');
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

    private function resolveSearch(mixed $rawSearch): ?string
    {
        if (!is_string($rawSearch)) {
            return null;
        }

        $search = trim($rawSearch);

        return $search === '' ? null : $search;
    }

    private function resolveDisplayFilter(mixed $rawDisplay): ?string
    {
        if (!is_string($rawDisplay)) {
            return null;
        }

        return match (trim($rawDisplay)) {
            'visible', 'hidden' => trim($rawDisplay),
            default => null,
        };
    }

    private function resolveHasImages(mixed $rawHasImages): ?string
    {
        if (!is_string($rawHasImages)) {
            return null;
        }

        return match (trim($rawHasImages)) {
            'with', 'without' => trim($rawHasImages),
            default => null,
        };
    }

    private function resolvePage(mixed $rawPage): int
    {
        if (is_int($rawPage)) {
            return max($rawPage, 1);
        }

        if (!is_string($rawPage) || !is_numeric($rawPage)) {
            return 1;
        }

        return max((int) $rawPage, 1);
    }

    private function shouldClampPage(LengthAwarePaginator $paginator): bool
    {
        return $paginator->currentPage() > $paginator->lastPage();
    }

    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParams(
        int $perPage,
        ?string $search,
        ?string $displayFilter,
        ?string $hasImages,
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

        if ($displayFilter !== null) {
            $query['display'] = $displayFilter;
        }

        if ($hasImages !== null) {
            $query['has_images'] = $hasImages;
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

    /**
     * @return array<int,string>
     */
    private function normalizeLocales(?string $locale, ?string $fallbackLocale): array
    {
        $values = array_filter([
            $locale !== null ? trim($locale) : null,
            $fallbackLocale !== null ? trim($fallbackLocale) : null,
        ]);

        return array_values(array_unique($values));
    }

}
