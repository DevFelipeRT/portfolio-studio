<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Infrastructure\Repositories;

use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Repositories\IPageRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Eloquent-backed implementation of the PageRepository contract.
 */
final class PageRepository implements IPageRepository
{
    public function findById(int $id): ?Page
    {
        return Page::query()->find($id);
    }

    public function findBySlugAndLocale(string $slug, string $locale): ?Page
    {
        return Page::query()
            ->where('slug', $slug)
            ->where('locale', $locale)
            ->first();
    }

    public function paginateByStatus(?PageStatus $status, int $perPage = 15): LengthAwarePaginator
    {
        $query = Page::query();

        if ($status !== null) {
            $query = $this->applyStatusFilter($query, $status);
        }

        return $query
            ->orderBy('internal_name')
            ->paginate($perPage);
    }

    /**
     * @return Collection<int,Page>
     */
    public function all(): Collection
    {
        return Page::query()
            ->orderBy('internal_name')
            ->get();
    }

    /**
     * @return array<int,string>
     */
    public function listLocales(): array
    {
        return Page::query()
            ->select('locale')
            ->distinct()
            ->orderBy('locale')
            ->pluck('locale')
            ->filter()
            ->values()
            ->all();
    }

    public function save(Page $page): Page
    {
        $page->save();

        return $page;
    }

    public function delete(Page $page): void
    {
        $page->delete();
    }

    /**
     * Applies a high-level status filter to the underlying query.
     */
    private function applyStatusFilter($query, PageStatus $status)
    {
        return match ($status) {
            PageStatus::Draft => $query->where('is_published', false),
            PageStatus::Published => $query->where('is_published', true),
            PageStatus::Archived => $query->where('is_published', false),
        };
    }
}
