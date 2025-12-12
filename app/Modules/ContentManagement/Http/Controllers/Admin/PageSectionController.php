<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Controllers\Admin;

use App\Modules\Shared\Abstractions\Base\Controller;
use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use App\Modules\ContentManagement\Http\Requests\Admin\PageSection\StorePageSectionRequest;
use App\Modules\ContentManagement\Http\Requests\Admin\PageSection\UpdatePageSectionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

/**
 * HTTP controller for managing page sections in the administrative interface.
 */
final class PageSectionController extends Controller
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly PageSectionService $pageSectionService,
    ) {
    }

    /**
     * Creates a new section for a given page and redirects back to the page edit screen.
     */
    public function store(StorePageSectionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $pageId = (int) $data['page_id'];

        $page = $this->pageService->findModelById($pageId);

        if ($page === null) {
            abort(404);
        }

        try {
            $this->pageSectionService->create($page, $data);
        } catch (InvalidArgumentException $exception) {
            return redirect()
                ->route('admin.content.pages.edit', $pageId)
                ->withErrors([
                    'page_section' => $exception->getMessage(),
                ])
                ->with('status', 'section.create_failed');
        } catch (Throwable $exception) {
            Log::error('Failed to create page section.', [
                'page_id' => $pageId,
                'exception' => $exception,
            ]);

            abort(500);
        }

        return redirect()
            ->route('admin.content.pages.edit', $pageId)
            ->with('status', 'section.created');
    }

    /**
     * Updates an existing section and redirects back to the page edit screen.
     */
    public function update(
        UpdatePageSectionRequest $request,
        PageSection $section,
    ): RedirectResponse {
        $data = $request->validated();

        $pageId = (int) ($data['page_id'] ?? $section->page_id);

        try {
            $this->pageSectionService->update($section, $data);
        } catch (InvalidArgumentException $exception) {
            return redirect()
                ->route('admin.content.pages.edit', $pageId)
                ->withErrors([
                    'page_section' => $exception->getMessage(),
                ])
                ->with('status', 'section.update_failed');
        } catch (Throwable $exception) {
            Log::error('Failed to update page section.', [
                'section_id' => (int) $section->id,
                'page_id' => $pageId,
                'exception' => $exception,
            ]);

            abort(500);
        }

        return redirect()
            ->route('admin.content.pages.edit', $pageId)
            ->with('status', 'section.updated');
    }

    /**
     * Toggles the active flag of a section and redirects back to the page edit screen.
     */
    public function toggleActive(Request $request, PageSection $section): RedirectResponse
    {
        $isActive = $request->has('is_active')
            ? $request->boolean('is_active')
            : !(bool) $section->is_active;

        $pageId = (int) $section->page_id;

        try {
            $this->pageSectionService->setActive($section, $isActive);
        } catch (InvalidArgumentException $exception) {
            return redirect()
                ->route('admin.content.pages.edit', $pageId)
                ->withErrors([
                    'page_section' => $exception->getMessage(),
                ])
                ->with('status', 'section.toggle_failed');
        } catch (Throwable $exception) {
            Log::error('Failed to toggle page section active state.', [
                'section_id' => (int) $section->id,
                'page_id' => $pageId,
                'exception' => $exception,
            ]);

            abort(500);
        }

        return redirect()
            ->route('admin.content.pages.edit', $pageId)
            ->with('status', 'section.toggled');
    }

    /**
     * Reorders sections for a given page and redirects back to the page edit screen.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'page_id' => ['required', 'integer'],
            'ordered_ids' => ['required', 'array'],
            'ordered_ids.*' => ['integer'],
        ]);

        $pageId = (int) $data['page_id'];

        $page = $this->pageService->findModelById($pageId);

        if ($page === null) {
            abort(404);
        }

        /** @var array<int,int> $orderedSectionIds */
        $orderedSectionIds = array_map('intval', $data['ordered_ids']);

        try {
            $this->pageSectionService->reorder($page, $orderedSectionIds);
        } catch (InvalidArgumentException $exception) {
            return redirect()
                ->route('admin.content.pages.edit', $pageId)
                ->withErrors([
                    'page_section' => $exception->getMessage(),
                ])
                ->with('status', 'section.reorder_failed');
        } catch (Throwable $exception) {
            Log::error('Failed to reorder page sections.', [
                'page_id' => $pageId,
                'ordered_ids' => $orderedSectionIds,
                'exception' => $exception,
            ]);

            abort(500);
        }

        return redirect()
            ->route('admin.content.pages.edit', $pageId)
            ->with('status', 'section.reordered');
    }

    /**
     * Deletes a section and redirects back to the page edit screen.
     */
    public function destroy(PageSection $section): RedirectResponse
    {
        $pageId = (int) $section->page_id;

        try {
            $this->pageSectionService->delete($section);
        } catch (InvalidArgumentException $exception) {
            return redirect()
                ->route('admin.content.pages.edit', $pageId)
                ->withErrors([
                    'page_section' => $exception->getMessage(),
                ])
                ->with('status', 'section.delete_failed');
        } catch (Throwable $exception) {
            Log::error('Failed to delete page section.', [
                'section_id' => (int) $section->id,
                'page_id' => $pageId,
                'exception' => $exception,
            ]);

            abort(500);
        }

        return redirect()
            ->route('admin.content.pages.edit', $pageId)
            ->with('status', 'section.deleted');
    }
}
