<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Initiative;
use App\Models\InitiativeImage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Service responsible for managing initiatives and their images.
 */
class InitiativeService
{
    public function __construct(
        private readonly InitiativeImageService $imageService,
    ) {}

    /**
     * List all initiatives ordered by period and identifier.
     *
     * @return Collection<int,Initiative>
     */
    public function listAll(): Collection
    {
        /** @var Collection<int,Initiative> $initiatives */
        $initiatives = Initiative::query()
            ->with('images')
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();

        return $initiatives;
    }

    /**
     * Retrieve initiatives that should be visible on the landing page.
     *
     * @return \Illuminate\Support\Collection<int,\App\Models\Initiative>
     */
    public function visible(): Collection
    {
        return Initiative::query()
            ->where('display', true)
            ->with('images')
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Create a new initiative with optional images.
     *
     * @param array<string,mixed>                $attributes
     * @param array<int,array<string,mixed>>     $images
     */
    public function create(array $attributes, array $images = []): Initiative
    {
        return DB::transaction(function () use ($attributes, $images): Initiative {
            $initiative = Initiative::create(
                $this->extractInitiativeAttributes($attributes)
            );

            if (!empty($images)) {
                $this->imageService->replaceImages($initiative, $images);
            }

            return $initiative->load('images');
        });
    }

    /**
     * Update an existing initiative and optionally replace images.
     *
     * If $images is null, images remain unchanged.
     *
     * @param array<string,mixed>                $attributes
     * @param array<int,array<string,mixed>>|null $images
     */
    public function update(
        Initiative $initiative,
        array $attributes,
        ?array $images = null
    ): Initiative {
        return DB::transaction(function () use ($initiative, $attributes, $images): Initiative {
            $initiative->update(
                $this->extractInitiativeAttributes($attributes)
            );

            if ($images !== null) {
                $this->imageService->replaceImages($initiative, $images);
            }

            return $initiative->load('images');
        });
    }

    /**
     * Delete an initiative and its images.
     */
    public function delete(Initiative $initiative): void
    {
        DB::transaction(function () use ($initiative): void {
            /** @var Collection<int,InitiativeImage> $images */
            $images = $initiative->images()->get();

            foreach ($images as $image) {
                $this->imageService->delete($image);
            }

            $initiative->delete();
        });
    }

    /**
     * Toggle the display flag for an initiative.
     */
    public function toggleDisplay(Initiative $initiative): Initiative
    {
        $initiative->display = ! $initiative->display;
        $initiative->save();

        return $initiative;
    }

    /**
     * Extract valid initiative attributes from raw input.
     *
     * @param array<string,mixed> $attributes
     * @return array<string,mixed>
     */
    private function extractInitiativeAttributes(array $attributes): array
    {
        $allowed = [
            'name',
            'short_description',
            'long_description',
            'display',
            'start_date',
            'end_date',
        ];

        return \array_intersect_key($attributes, \array_flip($allowed));
    }
}
