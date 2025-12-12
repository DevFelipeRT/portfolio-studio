<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Infrastructure\Repositories;

use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use App\Modules\ContentManagement\Domain\Repositories\IPageSectionRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Eloquent-backed implementation of the IPageSectionRepository contract.
 */
final class PageSectionRepository implements IPageSectionRepository
{
    public function findById(int $id): ?PageSection
    {
        return PageSection::query()->find($id);
    }

    /**
     * Returns all sections for the given page ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findByPage(Page $page): Collection
    {
        return $this->findByPageId($page->id);
    }

    /**
     * Returns all active sections for the given page ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findActiveByPage(Page $page): Collection
    {
        return $this->findActiveByPageId($page->id);
    }

    /**
     * Returns all sections that are visible for the given page at the reference time.
     *
     * @return Collection<int,PageSection>
     */
    public function findVisibleByPage(Page $page, CarbonInterface $referenceTime): Collection
    {
        return $this->findVisibleByPageId($page->id, $referenceTime);
    }

    /**
     * Returns all sections for the given page id ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findByPageId(int $pageId): Collection
    {
        return PageSection::query()
            ->where('page_id', $pageId)
            ->orderBy('position')
            ->get();
    }

    /**
     * Returns all active sections for the given page id ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findActiveByPageId(int $pageId): Collection
    {
        return PageSection::query()
            ->where('page_id', $pageId)
            ->active()
            ->orderBy('position')
            ->get();
    }

    /**
     * Returns all sections that are visible for the given page id at the reference time.
     *
     * @return Collection<int,PageSection>
     */
    public function findVisibleByPageId(int $pageId, CarbonInterface $referenceTime): Collection
    {
        return PageSection::query()
            ->where('page_id', $pageId)
            ->active()
            ->visibleAt($referenceTime)
            ->orderBy('position')
            ->get();
    }

    public function save(PageSection $section): PageSection
    {
        $section->save();

        return $section;
    }

    public function delete(PageSection $section): void
    {
        $section->delete();
    }
}
