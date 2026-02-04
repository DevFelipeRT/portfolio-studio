<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Services;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Images\Domain\Models\Image;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Service responsible for managing initiatives and their images.
 */
class InitiativeService
{
    public function __construct(
        private readonly InitiativeImageService $initiativeImageService,
    ) {
    }

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
     * @return Collection<int,Initiative>
     */
    public function visible(): Collection
    {
        /** @var Collection<int,Initiative> $initiatives */
        $initiatives = Initiative::query()
            ->where('display', true)
            ->with('images')
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->get();

        return $initiatives;
    }

    /**
     * Create a new initiative with optional images.
     *
     * @param array<string,mixed>            $attributes Initiative attributes.
     * @param array<int,array<string,mixed>> $images     Image payloads with uploaded file and metadata.
     */
    public function create(array $attributes, array $images = []): Initiative
    {
        return DB::transaction(function () use ($attributes, $images): Initiative {
            /** @var Initiative $initiative */
            $initiative = Initiative::create(
                $this->extractInitiativeAttributes($attributes)
            );

            if (!empty($images)) {
                $this->initiativeImageService->replace($initiative, $images);
            }

            return $initiative->load('images');
        });
    }

    /**
     * Update an existing initiative and optionally replace images.
     *
     * When $images is null, images remain unchanged.
     * When $images is an array, the existing collection is fully replaced.
     *
     * @param array<string,mixed>                 $attributes Initiative attributes.
     * @param array<int,array<string,mixed>>|null $images     Image payloads with uploaded file and metadata.
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
                $this->initiativeImageService->replace($initiative, $images);
            }

            return $initiative->load('images');
        });
    }

    /**
     * Delete an initiative and its images when they become orphaned.
     */
    public function delete(Initiative $initiative): void
    {
        DB::transaction(function () use ($initiative): void {
            /** @var Collection<int,Image> $images */
            $images = $initiative->images()->get();

            foreach ($images as $image) {
                $this->initiativeImageService->detach($initiative, $image);
            }

            $initiative->delete();
        });
    }

    /**
     * Toggle the display flag for an initiative.
     */
    public function toggleDisplay(Initiative $initiative): Initiative
    {
        $initiative->display = !$initiative->display;
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
            'locale',
            'name',
            'summary',
            'description',
            'display',
            'start_date',
            'end_date',
        ];

        return \array_intersect_key($attributes, \array_flip($allowed));
    }
}
