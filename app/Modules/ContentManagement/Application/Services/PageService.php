<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Application\Mappers\PageMapper;
use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Repositories\IPageRepository;
use App\Modules\ContentManagement\Domain\Services\PageStatusResolver;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Application-level service for managing content-managed pages.
 *
 * This service orchestrates repository access and publication logic,
 * returning PageDto instances to upper layers.
 */
final class PageService
{
    public function __construct(
        private readonly IPageRepository $pages,
        private readonly PageStatusResolver $statusResolver,
    ) {
    }

    /**
     * Returns a paginated listing of pages as PageDto instances,
     * filtered by status when provided.
     *
     * @return LengthAwarePaginator<PageDto>
     */
    public function paginate(?PageStatus $status, int $perPage = 15): LengthAwarePaginator
    {
        $paginator = $this->pages->paginateByStatus($status, $perPage);

        /** @var LengthAwarePaginator<PageDto> $mapped */
        $mapped = $paginator->through(
            static function (Page $page): PageDto {
                return PageMapper::toDto($page);
            },
        );

        return $mapped;
    }

    /**
     * Loads a single page by its identifier and maps it to a DTO.
     */
    public function getById(int $id): ?PageDto
    {
        $page = $this->pages->findById($id);

        if ($page === null) {
            return null;
        }

        return PageMapper::toDto($page);
    }

    /**
     * Loads a single page by slug and locale and maps it to a DTO.
     */
    public function getBySlugAndLocale(string $slug, string $locale): ?PageDto
    {
        $page = $this->pages->findBySlugAndLocale($slug, $locale);

        if ($page === null) {
            return null;
        }

        return PageMapper::toDto($page);
    }

    /**
     * Loads the Page domain model by its identifier.
     *
     * This method is intended for application or presentation services
     * that still need access to the underlying domain entity.
     */
    public function findModelById(int $id): ?Page
    {
        return $this->pages->findById($id);
    }

    /**
     * Creates a new page using the provided attributes and returns its DTO.
     *
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): PageDto
    {
        $page = new Page();

        $this->fillPage($page, $attributes);
        $this->ensurePublicationConsistency($page);

        $this->pages->save($page);

        return PageMapper::toDto($page);
    }

    /**
     * Updates an existing page with the provided attributes and returns its DTO.
     *
     * @param array<string,mixed> $attributes
     */
    public function update(Page $page, array $attributes): PageDto
    {
        $this->fillPage($page, $attributes);
        $this->ensurePublicationConsistency($page);

        $this->pages->save($page);

        return PageMapper::toDto($page);
    }

    /**
     * Publishes a page, optionally forcing a publication timestamp.
     */
    public function publish(Page $page, ?CarbonInterface $publishedAt = null): PageDto
    {
        $page->is_published = true;
        $page->published_at = $publishedAt ?? $page->published_at ?? Carbon::now();

        $this->pages->save($page);

        return PageMapper::toDto($page);
    }

    /**
     * Unpublishes a page and returns its DTO.
     *
     * The decision to clear or preserve published_at is delegated
     * to this service and can be adjusted if needed.
     */
    public function unpublish(Page $page, bool $clearPublishedAt = false): PageDto
    {
        $page->is_published = false;

        if ($clearPublishedAt) {
            $page->published_at = null;
        }

        $this->pages->save($page);

        return PageMapper::toDto($page);
    }

    /**
     * Removes a page.
     */
    public function delete(Page $page): void
    {
        $this->pages->delete($page);
    }

    /**
     * Resolves the high-level status for a page.
     */
    public function resolveStatus(Page $page): PageStatus
    {
        return $this->statusResolver->resolveForPage($page);
    }

    /**
     * Fills a Page model from the provided attribute array.
     *
     * @param array<string,mixed> $attributes
     */
    private function fillPage(Page $page, array $attributes): void
    {
        $page->fill($attributes);
    }

    /**
     * Ensures that publication-related fields are consistent.
     *
     * When a page is marked as published but has no published_at,
     * a timestamp is assigned automatically.
     */
    private function ensurePublicationConsistency(Page $page): void
    {
        if ($page->is_published && $page->published_at === null) {
            $page->published_at = Carbon::now();
        }
    }
}
