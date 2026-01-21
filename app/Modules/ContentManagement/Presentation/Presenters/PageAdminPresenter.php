<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Presenters;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Application\Mappers\TemplateDefinitionMapper;
use App\Modules\ContentManagement\Application\Services\ContentSettingsService;
use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Application\Services\Templates\TemplateTranslationService;
use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Templates\TemplateDefinition;
use App\Modules\ContentManagement\Domain\Templates\TemplateRegistry;
use App\Modules\ContentManagement\Presentation\ViewModels\Admin\PageEditViewModel;
use App\Modules\ContentManagement\Presentation\ViewModels\Admin\PageIndexViewModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\App;
use App\Modules\Shared\Support\Data\DataTransformer;
use ValueError;

/**
 * Presenter responsible for building administrative view models
 * for listing and editing content-managed pages.
 */
final class PageAdminPresenter
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly PageSectionService $pageSectionService,
        private readonly TemplateRegistry $templateRegistry,
        private readonly ContentSettingsService $contentSettings,
        private readonly TemplateTranslationService $templateTranslations,
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
        $status = $this->resolveStatusFilter($filters['status'] ?? null);

        /** @var LengthAwarePaginator<PageDto> $paginator */
        $paginator = $this->pageService->paginate($status, $perPage);

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
            ],
            $extraPayload,
        );

        return new PageIndexViewModel(
            pages: $pages,
            filters: $filters,
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
        $data = $this->buildPageData($pageId);

        if ($data === []) {
            return null;
        }

        $templates = $this->buildTemplatesData();

        return new PageEditViewModel(
            page: $data['page'],
            sections: $data['sections'],
            availableTemplates: $templates,
            extraPayload: $extraPayload,
        );
    }

    /**
     * Resolves a raw status filter into a PageStatus instance.
     */
    private function resolveStatusFilter(?string $rawStatus): ?PageStatus
    {
        if ($rawStatus === null || $rawStatus === '') {
            return null;
        }

        try {
            return PageStatus::from($rawStatus);
        } catch (ValueError) {
            return null;
        }
    }

    /**
     * Builds page and section data arrays for the given page identifier.
     *
     * The returned structure contains snake_case arrays for the page and its sections.
     *
     * @return array{
     *     page: array<string,mixed>,
     *     sections: array<int,array<string,mixed>>
     * }|array{}
     */
    private function buildPageData(int $pageId): array
    {
        $pageDto = $this->pageService->getById($pageId);

        if ($pageDto === null) {
            return [];
        }

        $sectionDtos = $this->pageSectionService->getByPageId($pageId);

        $page = DataTransformer::transform($pageDto)
            ->toArray()
            ->toSnakeCase()
            ->result();

        $sections = $this->buildSectionsData($sectionDtos);

        return [
            'page' => $page,
            'sections' => $sections,
        ];
    }

    /**
     * Transforms section DTOs into snake_case arrays suitable for the admin UI.
     *
     * @param array<int,mixed> $sectionDtos
     * @return array<int,array<string,mixed>>
     */
    private function buildSectionsData(array $sectionDtos): array
    {
        $sections = [];

        foreach ($sectionDtos as $sectionDto) {
            $sections[] = DataTransformer::transform($sectionDto)
                ->toArray()
                ->toSnakeCase()
                ->result();
        }

        return $sections;
    }

    /**
     * Builds template definition metadata for the administrative editor.
     *
     * Template definitions are mapped to DTOs and then converted to
     * snake_case arrays, including nested field structures and collection
     * item fields.
     *
     * @return array<int,array<string,mixed>>
     */
    private function buildTemplatesData(): array
    {
        /** @var array<int,TemplateDefinition> $definitions */
        $definitions = $this->templateRegistry->all();

        $templates = [];

        $locale = App::getLocale();

        foreach ($definitions as $definition) {
            $templates[] = TemplateDefinitionMapper::toDto(
                $definition,
                $this->templateTranslations,
                $locale,
            );
        }

        $data = DataTransformer::transform($templates)
            ->toArray()
            ->toSnakeCase()
            ->result();

        return $data;
    }
}
