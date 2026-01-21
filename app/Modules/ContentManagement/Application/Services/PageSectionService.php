<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services;

use App\Modules\ContentManagement\Application\Dtos\PageSectionDto;
use App\Modules\ContentManagement\Application\Mappers\PageSectionMapper;
use App\Modules\ContentManagement\Application\Services\Templates\TemplateValidationService;
use App\Modules\ContentManagement\Domain\Enums\SectionVisibility;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use App\Modules\ContentManagement\Domain\Repositories\IPageSectionRepository;
use App\Modules\ContentManagement\Domain\Services\SectionVisibilityResolver;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Carbon\CarbonInterface;
use InvalidArgumentException;

/**
 * Application-level service for managing page sections.
 *
 * This service orchestrates repository access, template resolution and
 * basic visibility handling, returning PageSectionDto instances to
 * upper layers.
 */
final class PageSectionService
{
    public function __construct(
        private readonly IPageSectionRepository $sections,
        private readonly TemplateValidationService $templateValidation,
        private readonly SectionVisibilityResolver $visibilityResolver,
        private readonly PageSectionImageService $sectionImageService,
    ) {
    }

    /**
     * Loads a single section by its identifier and maps it to a DTO.
     */
    public function getById(int $id): ?PageSectionDto
    {
        $section = $this->sections->findById($id);

        if ($section === null) {
            return null;
        }

        return PageSectionMapper::toDto($section);
    }

    /**
     * Returns all sections for the given page ordered by position.
     *
     * @return array<int,PageSectionDto>
     */
    public function getByPage(Page $page): array
    {
        $sections = $this->sections->findByPage($page);

        return $this->mapCollectionToDtos($sections);
    }

    /**
     * Returns all sections for the given page id ordered by position.
     *
     * @return array<int,PageSectionDto>
     */
    public function getByPageId(int $pageId): array
    {
        $sections = $this->sections->findByPageId($pageId);

        return $this->mapCollectionToDtos($sections);
    }

    /**
     * Returns all active sections for the given page ordered by position.
     *
     * @return array<int,PageSectionDto>
     */
    public function getActiveByPage(Page $page): array
    {
        $sections = $this->sections->findActiveByPage($page);

        return $this->mapCollectionToDtos($sections);
    }

    /**
     * Returns all visible sections for the given page at the reference time.
     *
     * @return array<int,PageSectionDto>
     */
    public function getVisibleByPage(Page $page, CarbonInterface $referenceTime): array
    {
        $sections = $this->sections->findVisibleByPage($page, $referenceTime);

        return $this->mapCollectionToDtos($sections);
    }

    /**
     * Creates a new section for the given page and returns its DTO.
     *
     * The attributes array is expected to be validated beforehand by
     * a dedicated FormRequest. The template_key must be present and
     * refer to a valid template in the template registry.
     *
     * @param array<string,mixed> $attributes
     */
    public function create(Page $page, array $attributes): PageSectionDto
    {
        $templateKey = $this->extractTemplateKey($attributes);

        $section = new PageSection();

        $section->page_id = $page->id;
        $section->template_key = $templateKey->value();

        $this->fillSection($section, $attributes);

        $data = is_array($section->data) ? $section->data : [];
        $locale = $page->locale ?: (string) config('content_management.locales.default', '');
        $normalizedData = $this->templateValidation->normalizeDataForTemplateKey(
            $templateKey,
            $data,
            $locale !== '' ? $locale : null,
        );

        $section->data = $normalizedData;

        $this->sections->save($section);
        $this->syncImagesForSection($section, $templateKey, $normalizedData);

        return PageSectionMapper::toDto($section);
    }

    /**
     * Updates an existing section and returns its DTO.
     *
     * The attributes array is expected to be validated beforehand by
     * a dedicated FormRequest. If template_key is provided it must
     * refer to a valid template in the template registry.
     *
     * @param array<string,mixed> $attributes
     */
    public function update(PageSection $section, array $attributes): PageSectionDto
    {
        $templateKey = $this->resolveTemplateKeyForUpdate($section, $attributes);

        $section->template_key = $templateKey->value();

        $this->fillSection($section, $attributes);

        $data = is_array($section->data) ? $section->data : [];
        $pageLocale = $section->page?->locale;
        $fallbackLocale = (string) config('content_management.locales.default', '');
        $locale = $pageLocale ?: $fallbackLocale;
        $normalizedData = $this->templateValidation->normalizeDataForTemplateKey(
            $templateKey,
            $data,
            $locale !== '' ? $locale : null,
        );

        $section->data = $normalizedData;

        $this->sections->save($section);
        $this->syncImagesForSection($section, $templateKey, $normalizedData);

        return PageSectionMapper::toDto($section);
    }

    /**
     * Sets the active flag for a section and returns its DTO.
     */
    public function setActive(PageSection $section, bool $isActive): PageSectionDto
    {
        $section->is_active = $isActive;

        $this->sections->save($section);

        return PageSectionMapper::toDto($section);
    }

    /**
     * Removes a section.
     */
    public function delete(PageSection $section): void
    {
        $this->sections->delete($section);
    }

    /**
     * Reorders sections of a page based on a new ordered list of section IDs.
     *
     * When the new ordering corresponds to a single section move, this method
     * applies a hole-shifting algorithm between the original and the target
     * position, touching only the affected range.
     *
     * If the provided IDs do not match the current sections or represent a
     * more complex permutation, the method falls back to a safe full
     * renumbering using the ordered IDs.
     *
     * @param Page             $page
     * @param array<int,int>   $orderedSectionIds
     */
    public function reorder(Page $page, array $orderedSectionIds): void
    {
        if ($orderedSectionIds === []) {
            return;
        }

        // Load current sections ordered by position
        $sections = $this->sections
            ->findByPage($page)
            ->sortBy('position')
            ->values();

        if ($sections->isEmpty()) {
            return;
        }

        $currentIds = $sections
            ->pluck('id')
            ->values()
            ->all();

        // Basic validation: sets of IDs must match
        sort($currentIds);
        $orderedCopy = $orderedSectionIds;
        sort($orderedCopy);

        if ($currentIds !== $orderedCopy) {
            // Fallback: IDs do not match, perform a full safe renumbering
            $this->reindexFromOrderedIds($page, $orderedSectionIds);

            return;
        }

        // Map new index by ID for quick lookup
        $newIndexById = [];
        foreach ($orderedSectionIds as $index => $id) {
            $newIndexById[$id] = $index;
        }

        // Detect which IDs changed position
        $changedIds = [];
        $maxDelta = 0;
        $movedId = null;
        $oldIndexOfMoved = null;
        $newIndexOfMoved = null;

        foreach ($sections as $oldIndex => $section) {
            $id = $section->id;
            $newIndex = $newIndexById[$id];

            if ($oldIndex !== $newIndex) {
                $changedIds[] = $id;

                $delta = abs($newIndex - $oldIndex);
                if ($delta > $maxDelta) {
                    $maxDelta = $delta;
                    $movedId = $id;
                    $oldIndexOfMoved = $oldIndex;
                    $newIndexOfMoved = $newIndex;
                }
            }
        }

        // No changes detected
        if ($movedId === null) {
            return;
        }

        // If more than one ID changed position, treat as complex permutation
        if (count($changedIds) > 1) {
            $this->reindexFromOrderedIds($page, $orderedSectionIds);

            return;
        }

        // At this point we treat the change as a single-element move
        $this->reorderSingleMove(
            $sections,
            $movedId,
            $oldIndexOfMoved,
            $newIndexOfMoved
        );
    }

    /**
     * Resolves the visibility state for a section at the given reference time.
     */
    public function resolveVisibility(
        PageSection $section,
        CarbonInterface $referenceTime,
    ): SectionVisibility {
        return $this->visibilityResolver->resolveForSection($section, $referenceTime);
    }

    /**
     * Applies the hole-shifting algorithm for a single moved section.
     *
     * @param \Illuminate\Support\Collection<int,PageSection> $sections
     * @param int                                             $movedId
     * @param int                                             $oldIndex
     * @param int                                             $newIndex
     */
    protected function reorderSingleMove(
        Collection $sections,
        int $movedId,
        int $oldIndex,
        int $newIndex,
    ): void {
        if ($oldIndex === $newIndex) {
            return;
        }

        /** @var PageSection $movedSection */
        $movedSection = $sections->get($oldIndex);

        if (!$movedSection instanceof PageSection || $movedSection->id !== $movedId) {
            // Defensive fallback in case of inconsistent state
            $this->reindexFromCurrentOrder($sections);

            return;
        }

        // Positions are assumed to reflect the current ordering
        $originalPosition = $movedSection->position;

        // Compute a temporary position greater than any existing one
        $maxPosition = (int) $sections->max('position');
        $tempPosition = $maxPosition + 1;

        DB::transaction(function () use ($sections, $movedSection, $oldIndex, $newIndex, $originalPosition, $tempPosition): void {
            // Step 1: move the target section out of the range
            $movedSection->position = $tempPosition;
            $this->sections->save($movedSection);

            // Step 2: walk from original index to new index, shifting neighbors
            $free = $originalPosition;

            if ($newIndex > $oldIndex) {
                // Moving down: iterate forward over (oldIndex+1 .. newIndex)
                for ($i = $oldIndex + 1; $i <= $newIndex; $i++) {
                    /** @var PageSection|null $section */
                    $section = $sections->get($i);
                    if (!$section instanceof PageSection) {
                        continue;
                    }

                    $currentPos = $section->position;
                    $section->position = $free;
                    $this->sections->save($section);

                    $free = $currentPos;
                }
            } else {
                // Moving up: iterate backward over (oldIndex-1 .. newIndex)
                for ($i = $oldIndex - 1; $i >= $newIndex; $i--) {
                    /** @var PageSection|null $section */
                    $section = $sections->get($i);
                    if (!$section instanceof PageSection) {
                        continue;
                    }

                    $currentPos = $section->position;
                    $section->position = $free;
                    $this->sections->save($section);

                    $free = $currentPos;
                }
            }

            // Step 3: place the moved section in the final position
            $movedSection->position = $free;
            $this->sections->save($movedSection);
        });
    }

    /**
     * Performs a full safe renumbering using the given ordered IDs.
     *
     * @param Page             $page
     * @param array<int,int>   $orderedSectionIds
     */
    protected function reindexFromOrderedIds(Page $page, array $orderedSectionIds): void
    {
        $sections = $this->sections
            ->findByPage($page)
            ->keyBy('id');

        if ($sections->isEmpty()) {
            return;
        }

        DB::transaction(function () use ($sections, $orderedSectionIds): void {
            $maxPosition = (int) $sections->max('position');
            $count = count($orderedSectionIds);
            $offset = $maxPosition + $count + 1;

            // First pass: assign temporary positions to avoid unique conflicts
            foreach ($orderedSectionIds as $index => $sectionId) {
                /** @var PageSection|null $section */
                $section = $sections->get($sectionId);
                if (!$section instanceof PageSection) {
                    continue;
                }

                $section->position = $offset + $index;
                $this->sections->save($section);
            }

            // Second pass: assign final normalized positions (1..N)
            $position = 1;
            foreach ($orderedSectionIds as $sectionId) {
                /** @var PageSection|null $section */
                $section = $sections->get($sectionId);
                if (!$section instanceof PageSection) {
                    continue;
                }

                $section->position = $position;
                $this->sections->save($section);

                $position++;
            }
        });
    }

    /**
     * Fallback renumbering from the current collection order.
     *
     * @param \Illuminate\Support\Collection<int,PageSection> $sections
     */
    protected function reindexFromCurrentOrder(Collection $sections): void
    {
        if ($sections->isEmpty()) {
            return;
        }

        DB::transaction(function () use ($sections): void {
            $maxPosition = (int) $sections->max('position');
            $count = $sections->count();
            $offset = $maxPosition + $count + 1;

            // First pass: temporary positions
            foreach ($sections as $index => $section) {
                if (!$section instanceof PageSection) {
                    continue;
                }

                $section->position = $offset + $index;
                $this->sections->save($section);
            }

            // Second pass: normalized positions
            $position = 1;
            foreach ($sections as $section) {
                if (!$section instanceof PageSection) {
                    continue;
                }

                $section->position = $position;
                $this->sections->save($section);

                $position++;
            }
        });
    }

    /**
     * Maps a collection of PageSection models to an array of DTOs.
     *
     * @param Collection<int,PageSection> $sections
     * @return array<int,PageSectionDto>
     */
    private function mapCollectionToDtos(Collection $sections): array
    {
        $result = [];

        foreach ($sections as $section) {
            $result[] = PageSectionMapper::toDto($section);
        }

        return $result;
    }

    /**
     * Fills a PageSection model from the provided attribute array.
     *
     * @param array<string,mixed> $attributes
     */
    private function fillSection(PageSection $section, array $attributes): void
    {
        $fillable = [
            'slot',
            'position',
            'anchor',
            'navigation_label',
            'data',
            'is_active',
            'visible_from',
            'visible_until',
            'locale',
        ];

        $payload = [];

        foreach ($fillable as $key) {
            if (array_key_exists($key, $attributes)) {
                $payload[$key] = $attributes[$key];
            }
        }

        if ($payload !== []) {
            $section->fill($payload);
        }
    }

    /**
     * Extracts and validates the template key from the creation attributes.
     *
     * @param array<string,mixed> $attributes
     */
    private function extractTemplateKey(array $attributes): TemplateKey
    {
        if (!array_key_exists('template_key', $attributes)) {
            throw new InvalidArgumentException('Attribute "template_key" is required for creating a section.');
        }

        return TemplateKey::fromString((string) $attributes['template_key']);
    }

    /**
     * Resolves the template key for an update operation.
     *
     * When a new template_key is provided, it replaces the current one.
     * When it is not provided, the current template_key is reused.
     *
     * @param array<string,mixed> $attributes
     */
    private function resolveTemplateKeyForUpdate(PageSection $section, array $attributes): TemplateKey
    {
        if (array_key_exists('template_key', $attributes)) {
            return TemplateKey::fromString((string) $attributes['template_key']);
        }

        return TemplateKey::fromString((string) $section->template_key);
    }

    /**
     * Resolves media fields for the given template key.
     *
     * @return array<int,array{name: string, type: string}>
     */
    private function resolveMediaFieldsForTemplate(TemplateKey $templateKey): array
    {
        $definition = $this->templateValidation->getDefinitionForKey($templateKey);

        $mediaFields = [];

        foreach ($definition->fields() as $field) {
            $type = $field->type();

            if ($type !== 'image' && $type !== 'image_gallery') {
                continue;
            }

            $mediaFields[] = [
                'name' => $field->name(),
                'type' => $type,
            ];
        }

        return $mediaFields;
    }

    /**
     * Synchronizes image attachments for the given section and template.
     *
     * @param array<string,mixed> $normalizedData
     */
    private function syncImagesForSection(
        PageSection $section,
        TemplateKey $templateKey,
        array $normalizedData
    ): void {
        $mediaFields = $this->resolveMediaFieldsForTemplate($templateKey);

        if ($mediaFields === []) {
            return;
        }

        $this->sectionImageService->syncSectionImages(
            $section,
            $mediaFields,
            $normalizedData,
        );
    }
}
