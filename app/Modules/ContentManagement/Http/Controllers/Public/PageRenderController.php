<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Controllers\Public;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\ContentManagement\Application\Services\PublicPageLocaleResolver;
use App\Modules\ContentManagement\Presentation\Presenters\PagePresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller responsible for rendering public content-managed pages.
 */
final class PageRenderController extends Controller
{
    public function __construct(
        private readonly PagePresenter $pagePresenter,
        private readonly PublicPageLocaleResolver $localeResolver,
    ) {
    }

    /**
     * Displays a public page resolved by slug and current locale.
     */
    public function show(Request $request, string $slug): Response
    {
        $locale = $this->localeResolver->resolveForSlug($request, $slug);

        App::setLocale($locale);

        $viewModel = $this->pagePresenter->renderBySlugAndLocale($slug, $locale);

        if ($viewModel === null) {
            abort(404);
        }

        return Inertia::render('content-management/public/RenderedPage', [
            'page' => $viewModel->page,
            'sections' => $viewModel->sections,
            'extra' => $viewModel->extraPayload,
        ]);
    }

    /**
     * Displays the configured home page for the current locale.
     */
    public function home(Request $request): Response
    {
        $locale = $this->localeResolver->resolveForHome($request);

        App::setLocale($locale);

        $viewModel = $this->pagePresenter->renderHomeByLocale($locale);

        if ($viewModel === null) {
            abort(404);
        }

        return Inertia::render('content-management/public/RenderedPage', [
            'page' => $viewModel->page,
            'sections' => $viewModel->sections,
            'extra' => $viewModel->extraPayload,
        ]);
    }

}
