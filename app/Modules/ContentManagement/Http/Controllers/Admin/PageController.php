<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Controllers\Admin;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Http\Requests\Admin\Page\StorePageRequest;
use App\Modules\ContentManagement\Http\Requests\Admin\Page\UpdatePageRequest;
use App\Modules\ContentManagement\Presentation\Presenters\PageAdminPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing content pages in the administrative interface.
 */
final class PageController extends Controller
{
    private const DEFAULT_PER_PAGE = 15;

    public function __construct(
        private readonly PageService $pageService,
        private readonly PageAdminPresenter $pageAdminPresenter,
    ) {
    }

    /**
     * Displays the paginated listing of pages with optional filters.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'status' => $request->query('status'),
            'locale' => $request->query('locale'),
            'search' => $request->query('search'),
            'sort' => $request->query('sort'),
            'direction' => $request->query('direction'),
        ];

        $viewModel = $this->pageAdminPresenter->buildIndexViewModel(
            filters: $filters,
            perPage: $this->resolvePerPage($request),
        );

        return Inertia::render('content-management/admin/PageIndex', [
            'pages' => $viewModel->pages,
            'filters' => $viewModel->filters,
            'extra' => $viewModel->extraPayload,
        ]);
    }

    private function resolvePerPage(Request $request): int
    {
        $perPage = $request->integer('per_page', self::DEFAULT_PER_PAGE);

        if ($perPage < 1) {
            return self::DEFAULT_PER_PAGE;
        }

        return min($perPage, 100);
    }

    /**
     * Displays the page creation form.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('content-management/admin/PageCreate');
    }

    /**
     * Persists a newly created page and redirects to the edit screen.
     */
    public function store(StorePageRequest $request): RedirectResponse
    {
        $dto = $this->pageService->create($request->validated());

        return redirect()
            ->route('admin.content.pages.edit', $dto->id)
            ->with('status', 'page.created');
    }

    /**
     * Displays the edit screen for a specific page.
     */
    public function edit(Page $page): Response
    {
        $viewModel = $this->pageAdminPresenter->buildEditViewModel($page->id);

        if ($viewModel === null) {
            abort(404);
        }

        return Inertia::render('content-management/admin/PageEdit', [
            'page' => $viewModel->page,
            'sections' => $viewModel->sections,
            'availableTemplates' => $viewModel->availableTemplates,
            'extra' => $viewModel->extraPayload,
        ]);
    }

    /**
     * Updates a page and redirects back to the edit screen.
     */
    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $this->pageService->update($page, $request->validated());

        return redirect()
            ->route('admin.content.pages.edit', $page->id)
            ->with('status', 'page.updated');
    }

    /**
     * Marks the given page as the home page and redirects to the index.
     */
    public function setHome(Page $page): RedirectResponse
    {
        $this->pageService->setHomePage($page);

        return redirect()
            ->route('admin.content.pages.index')
            ->with('status', 'page.set_home');
    }

    /**
     * Deletes a page and redirects to the index.
     */
    public function destroy(Page $page): RedirectResponse
    {
        $this->pageService->delete($page);

        return redirect()
            ->route('admin.content.pages.index')
            ->with('status', 'page.deleted');
    }
}
