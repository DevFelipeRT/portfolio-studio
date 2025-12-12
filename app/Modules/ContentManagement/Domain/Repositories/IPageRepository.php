<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Repositories;

use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Models\Page;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Contract for querying and persisting content-managed pages.
 */
interface IPageRepository
{
    /**
     * Finds a page by its primary identifier.
     */
    public function findById(int $id): ?Page;

    /**
     * Finds a page by its slug and locale combination.
     */
    public function findBySlugAndLocale(string $slug, string $locale): ?Page;

    /**
     * Returns a paginated listing of pages filtered by status when provided.
     */
    public function paginateByStatus(?PageStatus $status, int $perPage = 15): LengthAwarePaginator;

    /**
     * Returns all pages.
     *
     * @return Collection<int,Page>
     */
    public function all(): Collection;

    /**
     * Persists the given page instance.
     */
    public function save(Page $page): Page;

    /**
     * Removes the given page instance.
     */
    public function delete(Page $page): void;
}
