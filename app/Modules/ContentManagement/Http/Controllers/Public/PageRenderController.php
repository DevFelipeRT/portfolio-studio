<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Controllers\Public;

use App\Modules\Shared\Abstractions\Base\Controller;
use App\Modules\ContentManagement\Presentation\Presenters\PagePresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller responsible for rendering public content-managed pages.
 */
final class PageRenderController extends Controller
{
    public function __construct(
        private readonly PagePresenter $pagePresenter,
    ) {
    }

    /**
     * Displays a public page resolved by slug and current locale.
     */
    public function show(Request $request, string $slug): Response
    {
        $locale = (string) app()->getLocale();

        $viewModel = $this->pagePresenter->renderBySlugAndLocale($slug, $locale);

        if ($viewModel === null) {
            abort(404);
        }

        return Inertia::render('ContentManagement/Pages/Public/RenderedPage', [
            'page' => $viewModel->page,
            'sections' => $viewModel->sections,
            'extra' => $viewModel->extraPayload,
        ]);
    }
}
