<?php

declare(strict_types=1);

namespace App\Modules\Images\Http\Controllers;

use App\Modules\Shared\Abstractions\Base\Controller;
use App\Modules\Images\Domain\Models\Image;
use App\Modules\Images\Application\Services\ImageService;
use App\Modules\Images\Http\Requests\Image\BulkDestroyImageRequest;
use App\Modules\Images\Http\Requests\Image\UpdateImageRequest;
use App\Modules\Images\Presentation\Mappers\ImageMapper;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing images at a global level.
 *
 * This controller exposes endpoints to list, create, inspect, update and delete
 * Image records, independent of their specific owners.
 */
class ImageController extends Controller
{
    private const DEFAULT_PER_PAGE = '15';

    /**
     * Create a new controller instance.
     */
    public function __construct(
        private readonly ImageService $imageService,
    ) {
    }

    /**
     * Display a paginated listing of images with optional filters.
     */
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', self::DEFAULT_PER_PAGE);

        $filters = [
            'search' => $request->query('search'),
            'usage' => $request->query('usage'),
            'mime_type' => $request->query('mime_type'),
            'storage_disk' => $request->query('storage_disk'),
        ];

        $images = $this->imageService
            ->paginate($filters, $perPage)
            ->withQueryString()
            ->through(
                static fn(Image $image): array => ImageMapper::toArray($image)
            );

        return Inertia::render('Images/Index', [
            'images' => $images,
            'filters' => [
                'search' => $filters['search'],
                'usage' => $filters['usage'],
                'mime_type' => $filters['mime_type'],
                'storage_disk' => $filters['storage_disk'],
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new image.
     */
    public function create(): Response
    {
        return Inertia::render('Images/Create');
    }

    /**
     * Store a newly uploaded image and its basic metadata.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'image'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'image_title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
        ]);

        /** @var \Illuminate\Http\UploadedFile $file */
        $file = $validated['file'];

        $image = $this->imageService->createFromUploadedFile(
            $file,
            'images',
            [
                'alt_text' => $validated['alt_text'] ?? null,
                'image_title' => $validated['image_title'] ?? null,
                'caption' => $validated['caption'] ?? null,
            ],
        );

        return redirect()
            ->route('images.edit', $image)
            ->with('success', 'Image created successfully.');
    }

    /**
     * Show the form for editing the specified image and its global metadata.
     */
    public function edit(Image $image): Response
    {
        $imageWithUsage = $this->imageService->loadUsage($image);

        return Inertia::render('Images/Edit', [
            'image' => $imageWithUsage,
        ]);
    }

    /**
     * Update the specified image global metadata.
     */
    public function update(UpdateImageRequest $request, Image $image): RedirectResponse
    {
        $data = $request->validated();

        $this->imageService->updateMetadata($image, $data);

        return redirect()
            ->back()
            ->with('success', 'Image updated successfully.');
    }

    /**
     * Remove the specified image from the system.
     */
    public function destroy(Image $image): RedirectResponse
    {
        $this->imageService->deleteCompletely($image);

        return redirect()
            ->route('images.index')
            ->with('success', 'Image deleted successfully.');
    }

    /**
     * Remove multiple images from the system in a single operation.
     */
    public function bulkDestroy(BulkDestroyImageRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->imageService->bulkDeleteCompletely($data['image_ids']);

        return redirect()
            ->route('images.index')
            ->with('success', 'Selected images deleted successfully.');
    }
}
