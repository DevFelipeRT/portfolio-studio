<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Presenters;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Presentation\Builders\AdminPageDataBuilder;
use App\Modules\ContentManagement\Presentation\Builders\AdminTemplateDefinitionsBuilder;
use App\Modules\ContentManagement\Application\Services\ContentSettingsService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Presentation\Resolvers\PageIndexFiltersResolver;
use App\Modules\ContentManagement\Presentation\ViewModels\Admin\PageEditViewModel;
use App\Modules\ContentManagement\Presentation\ViewModels\Admin\PageIndexViewModel;
use App\Modules\Shared\Support\Data\DataTransformer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Presenter responsible for building administrative view models
 * for listing and editing content-managed pages.
 */
final class PageAdminPresenter
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly ContentSettingsService $contentSettings,
        private readonly PageIndexFiltersResolver $pageIndexFiltersResolver,
        private readonly AdminPageDataBuilder $adminPageDataBuilder,
        private readonly AdminTemplateDefinitionsBuilder $adminTemplateDefinitionsBuilder,
    ) {
    }

    /**
     * Builds the view model for the administrative page index screen.
     *
     * Pages are exposed as snake_case arrays derived from PageDto instances.
     *
     * @param array<string,mixed> $filters
     * @param array<string,mixed> $extraPayload
     */
    public function buildIndexViewModel(
        array $filters = [],
        int $perPage = 15,
        array $extraPayload = [],
    ): PageIndexViewModel {
        $resolvedFilters = $this->pageIndexFiltersResolver->resolve($filters);

        /** @var LengthAwarePaginator<PageDto> $paginator */
        $paginator = $this->pageService
            ->paginate(
                $resolvedFilters->status,
                $resolvedFilters->locale,
                $resolvedFilters->search,
                $perPage,
                $resolvedFilters->sort,
                $resolvedFilters->direction,
            )
            ->withQueryString();

        $pages = $paginator->through(
            static function (PageDto $page): array {
                return DataTransformer::transform($page)
                    ->toArray()
                    ->toSnakeCase()
                    ->result();
            }
        );

        $effectiveExtraPayload = array_merge(
            [
                'homeSlug' => $this->contentSettings->getHomeSlug(),
                'locales' => $this->pageService->listLocales(),
                'sorting' => [
                    'sortable_columns' => $this->pageService->getSortableAvailability(
                        $resolvedFilters->status,
                        $resolvedFilters->locale,
                        $resolvedFilters->search,
                    ),
                ],
            ],
            $extraPayload,
        );

        return new PageIndexViewModel(
            pages: $pages,
            filters: $resolvedFilters->toArray($perPage),
            extraPayload: $effectiveExtraPayload,
        );
    }

    /**
     * Builds the view model for the administrative page edit screen.
     *
     * Returns null when the requested page is not found.
     *
     * @param array<string,mixed> $extraPayload
     */
    public function buildEditViewModel(
        int $pageId,
        array $extraPayload = [],
    ): ?PageEditViewModel {
        $data = $this->adminPageDataBuilder->build($pageId);

        if ($data === []) {
            return null;
        }

        $templates = $this->adminTemplateDefinitionsBuilder->build();

        return new PageEditViewModel(
            page: $data['page'],
            sections: $data['sections'],
            availableTemplates: $templates,
            extraPayload: $extraPayload,
        );
    }

}
