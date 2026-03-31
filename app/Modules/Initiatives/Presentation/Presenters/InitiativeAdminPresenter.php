<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Presentation\Presenters;

use App\Modules\Images\Domain\Models\Image;
use App\Modules\Initiatives\Application\Services\InitiativeTranslationResolver;
use App\Modules\Initiatives\Domain\Models\Initiative;
use Illuminate\Support\Collection;

final class InitiativeAdminPresenter
{
    public function __construct(
        private readonly InitiativeTranslationResolver $translationResolver,
    ) {
    }

    /**
     * @return array<string,mixed>
     */
    public function toListItem(
        Initiative $initiative,
        string $locale,
        ?string $fallbackLocale = null,
    ): array {
        return [
            'id' => $initiative->id,
            'locale' => $initiative->locale,
            'name' => $this->translationResolver->resolveName(
                $initiative,
                $locale,
                $fallbackLocale,
            ),
            'summary' => $this->translationResolver->resolveSummary(
                $initiative,
                $locale,
                $fallbackLocale,
            ),
            'display' => $initiative->display,
            'start_date' => $this->formatDate($initiative->start_date),
            'end_date' => $this->formatDate($initiative->end_date),
            'image_count' => (int) ($initiative->images_count ?? 0),
        ];
    }

    /**
     * @return array<string,mixed>
     */
    public function toDetail(
        Initiative $initiative,
        string $locale,
        ?string $fallbackLocale = null,
    ): array {
        /** @var Collection<int,Image> $images */
        $images = $initiative->images instanceof Collection
            ? $initiative->images
            : collect();

        return [
            'id' => $initiative->id,
            'locale' => $initiative->locale,
            'name' => $this->translationResolver->resolveName(
                $initiative,
                $locale,
                $fallbackLocale,
            ),
            'summary' => $this->translationResolver->resolveSummary(
                $initiative,
                $locale,
                $fallbackLocale,
            ),
            'description' => $this->translationResolver->resolveDescription(
                $initiative,
                $locale,
                $fallbackLocale,
            ),
            'display' => $initiative->display,
            'start_date' => $this->formatDate($initiative->start_date),
            'end_date' => $this->formatDate($initiative->end_date),
            'created_at' => $this->formatDate($initiative->created_at),
            'updated_at' => $this->formatDate($initiative->updated_at),
            'images' => $images
                ->map(static fn(Image $image): array => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'alt' => $image->alt_text,
                    'title' => $image->image_title,
                    'caption' => $image->caption,
                    'alt_text' => $image->alt_text,
                    'image_title' => $image->image_title,
                    'position' => $image->pivot?->position,
                    'is_cover' => (bool) ($image->pivot?->is_cover ?? false),
                    'owner_caption' => $image->pivot?->caption,
                ])
                ->values()
                ->all(),
        ];
    }

    private function formatDate(mixed $date): ?string
    {
        return $date?->format('Y-m-d');
    }
}
