<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Repositories;

use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Contract for querying and persisting page sections.
 */
interface IPageSectionRepository
{
    /**
     * Finds a section by its primary identifier.
     */
    public function findById(int $id): ?PageSection;

    /**
     * Returns all sections for the given page ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findByPage(Page $page): Collection;

    /**
     * Returns all active sections for the given page ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findActiveByPage(Page $page): Collection;

    /**
     * Returns all sections that are visible for the given page at the reference time.
     *
     * @return Collection<int,PageSection>
     */
    public function findVisibleByPage(Page $page, CarbonInterface $referenceTime): Collection;

    /**
     * Returns all sections for the given page id ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findByPageId(int $pageId): Collection;

    /**
     * Returns all active sections for the given page id ordered by position.
     *
     * @return Collection<int,PageSection>
     */
    public function findActiveByPageId(int $pageId): Collection;

    /**
     * Returns all sections that are visible for the given page id at the reference time.
     *
     * @return Collection<int,PageSection>
     */
    public function findVisibleByPageId(int $pageId, CarbonInterface $referenceTime): Collection;

    /**
     * Persists the given section instance.
     */
    public function save(PageSection $section): PageSection;

    /**
     * Removes the given section instance.
     */
    public function delete(PageSection $section): void;
}
