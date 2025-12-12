<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Presenters;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Application\Mappers\TemplateDefinitionMapper;
use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Domain\Enums\PageStatus;
use App\Modules\ContentManagement\Domain\Template\TemplateDefinition;
use App\Modules\ContentManagement\Domain\Template\TemplateRegistry;
use App\Modules\ContentManagement\Presentation\ViewModels\Admin\PageEditViewModel;
use App\Modules\ContentManagement\Presentation\ViewModels\Admin\PageIndexViewModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Modules\Shared\Support\Data\DataTransformer;
use ValueError;

/**
 * Presentation-level presenter that orchestrates data needed
 * by administrative pages for listing and editing content-managed pages.
 */
final class PageAdminPresenter
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly PageSectionService $pageSectionService,
        private readonly TemplateRegistry $templateRegistry,
    ) {
    }

    /**
     * Builds the view model for the administrative page index screen.
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

        return new PageIndexViewModel(
            pages: $pages,
            filters: $filters,
            extraPayload: $extraPayload,
        );
    }

    /**
     * Builds the view model for the administrative page edit screen.
     *
     * Returns null when the page does not exist.
     *
     * @param array<string,mixed> $extraPayload
     */
    public function buildEditViewModel(
        int $pageId,
        array $extraPayload = [],
    ): ?PageEditViewModel {
        $data = $this->buildPageData($pageId);
        $templateDtos = $this->buildTemplateDtos();

        return new PageEditViewModel(
            page: $data['page'],
            sections: $data['sections'],
            availableTemplates: $templateDtos,
            extraPayload: $extraPayload,
        );
    }

    /**
     * Converts a raw status filter into a PageStatus instance.
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
            'sections' => $sections
        ];
    }

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
     * Builds TemplateDefinitionDto instances for all registered templates.
     *
     * @return array<int,\App\Modules\ContentManagement\Application\Dtos\TemplateDefinitionDto>
     */
    private function buildTemplateDtos(): array
    {
        /** @var array<int,TemplateDefinition> $definitions */
        $definitions = $this->templateRegistry->all();

        $result = [];

        foreach ($definitions as $definition) {
            $result[] = TemplateDefinitionMapper::toDto($definition);
        }

        return $result;
    }
}
