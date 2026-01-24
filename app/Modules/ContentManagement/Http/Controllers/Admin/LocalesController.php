<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Controllers\Admin;

use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Http\JsonResponse;

final class LocalesController extends Controller
{
    public function __construct(private readonly PageService $pageService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'locales' => $this->pageService->listLocales(),
        ]);
    }
}
