<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Presenters;

use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Application\Dtos\PageSectionDto;
use App\Modules\ContentManagement\Application\Mappers\TemplateDefinitionMapper;
use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Template\TemplateRegistry;
use App\Modules\ContentManagement\Presentation\ViewModels\Public\PageRenderViewModel;
use App\Modules\Shared\Support\Data\DataTransformer;
use Carbon\Carbon;
use Carbon\CarbonInterface;

/**
 * Presentation-level presenter responsible for building a renderable representation
 * of a content-managed page, including its visible sections and optional
 * template metadata.
 *
 * This presenter depends only on application services and domain-level
 * template registry, keeping data access concerns inside the application layer.
 */
final class PagePresenter
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly PageSectionService $pageSections,
        private readonly TemplateRegistry $templateRegistry,
    ) {
    }

    /**
     * Resolves and renders a page by slug and locale.
     *
     * Returns null when no page exists for the given combination.
     *
     * @param array<string,mixed> $extraPayload
     */
    public function renderBySlugAndLocale(
        string $slug,
        string $locale,
        ?CarbonInterface $referenceTime = null,
        array $extraPayload = [],
    ): ?PageRenderViewModel {
        $pageDto = $this->pageService->getBySlugAndLocale($slug, $locale);

        if ($pageDto === null) {
            return null;
        }

        $pageModel = $this->pageService->findModelById($pageDto->id);

        if (!$pageModel instanceof Page) {
            return null;
        }

        return $this->renderPage($pageModel, $pageDto, $referenceTime, $extraPayload);
    }

    /**
     * Renders a page instance into a view model.
     *
     * This method loads sections that are visible at the reference time,
     * uses the provided PageDto for front-end data and optionally enriches
     * the payload with template metadata.
     *
     * @param array<string,mixed> $extraPayload
     */
    public function renderPage(
        Page $pageModel,
        PageDto $pageDto,
        ?CarbonInterface $referenceTime = null,
        array $extraPayload = [],
    ): PageRenderViewModel {
        $reference = $referenceTime ?? Carbon::now();

        $sectionDtos = $this->pageSections->getVisibleByPage($pageModel, $reference);

        $sections = [];
        foreach ($sectionDtos as $sectionDto) {
            $sections[] = DataTransformer::transform($sectionDto)
                ->toArray()
                ->toSnakeCase()
                ->result();
        }

        $templates = $this->buildTemplatesData($sections);

        $payload = array_merge(
            ['templates' => $templates],
            $extraPayload,
        );

        $page = DataTransformer::transform($pageDto)
            ->toArray()
            ->toSnakeCase()
            ->result();

        return new PageRenderViewModel(
            page: $page,
            sections: $sections,
            extraPayload: $payload,
        );
    }



    /**
     * Builds template definition array data for the templates used by the given sections.
     */
    private function buildTemplatesData(array $sections): array
    {
        $uniqueKeys = [];

        foreach ($sections as $section) {
            $uniqueKeys[$section['template_key']] = true;
        }

        $result = [];

        foreach (array_keys($uniqueKeys) as $templateKey) {
            $definition = $this->templateRegistry->find($templateKey);

            if ($definition === null) {
                continue;
            }

            $dto = TemplateDefinitionMapper::toDto($definition);
            $result[] = $this->toSnakeCaseArray($dto);
        }

        return $result;
    }

    private function toSnakeCaseArray(mixed $input): array
    {
        return DataTransformer::transform($input)
            ->toArray()
            ->toSnakeCase()
            ->result();
    }
}
