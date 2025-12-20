<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Presenters;

use App\Modules\ContentManagement\Application\Capabilities\SectionCapabilitiesDataFetcher;
use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Application\Dtos\PageSectionDto;
use App\Modules\ContentManagement\Application\Mappers\TemplateDefinitionMapper;
use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Templates\TemplateDataSource;
use App\Modules\ContentManagement\Domain\Templates\TemplateRegistry;
use App\Modules\ContentManagement\Presentation\ViewModels\Public\PageRenderViewModel;
use App\Modules\Shared\Support\Data\DataTransformer;
use Carbon\Carbon;
use Carbon\CarbonInterface;

/**
 * Presentation-level presenter responsible for building a renderable representation
 * of a content-managed page, including its visible sections and optional
 * template metadata.
 *
 * This presenter depends only on application services and the domain-level
 * template registry, keeping data access concerns inside the application layer.
 */
final class PagePresenter
{
    /**
     * Section array keys.
     */
    private const string SECTION_TEMPLATE_KEY = 'template_key';
    private const string SECTION_DATA_KEY = 'data';

    /**
     * Extra payload keys.
     */
    private const string PAYLOAD_TEMPLATES_KEY = 'templates';

    /**
     * Capability result keys.
     */
    private const string CAPABILITY_TARGET_FIELD_KEY = 'target_field';
    private const string CAPABILITY_VALUE_KEY = 'value';

    /**
     * Template configuration keys.
     */
    private const string TEMPLATE_CONFIG_CAPABILITY_KEY = 'capability';
    private const string TEMPLATE_CONFIG_FIELD_PARAMETER_MAP_KEY = 'field_parameter_map';
    private const string TEMPLATE_CONFIG_TARGET_FIELD_KEY = 'target_field';

    /**
     * Default values.
     */
    private const string DEFAULT_CAPABILITY_TARGET_FIELD = 'items';

    public function __construct(
        private readonly PageService $pageService,
        private readonly PageSectionService $pageSections,
        private readonly TemplateRegistry $templateRegistry,
        private readonly SectionCapabilitiesDataFetcher $sectionCapabilitiesDataFetcher,
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

        /** @var array<int,PageSectionDto> $sectionDtos */
        $sectionDtos = $this->pageSections->getVisibleByPage($pageModel, $reference);

        $capabilityResults = $this->resolveCapabilitiesForSections($sectionDtos);

        $sections = [];

        foreach ($sectionDtos as $index => $sectionDto) {
            $sectionArray = DataTransformer::transform($sectionDto)
                ->toArray()
                ->toSnakeCase()
                ->result();

            if (isset($capabilityResults[$index])) {
                $targetField = $capabilityResults[$index][self::CAPABILITY_TARGET_FIELD_KEY];
                $value = $capabilityResults[$index][self::CAPABILITY_VALUE_KEY];

                $data = $sectionArray[self::SECTION_DATA_KEY] ?? [];

                if (!is_array($data)) {
                    $data = [];
                }

                $data[$targetField] = $value;
                $sectionArray[self::SECTION_DATA_KEY] = $data;
            }

            $sections[] = $sectionArray;
        }

        $templates = $this->buildTemplatesData($sections);

        $payload = array_merge(
            [self::PAYLOAD_TEMPLATES_KEY => $templates],
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
     *
     * @param array<int,array<string,mixed>> $sections
     * @return array<int,array<string,mixed>>
     */
    private function buildTemplatesData(array $sections): array
    {
        $uniqueKeys = [];

        foreach ($sections as $section) {
            if (!isset($section[self::SECTION_TEMPLATE_KEY])) {
                continue;
            }

            $uniqueKeys[(string) $section[self::SECTION_TEMPLATE_KEY]] = true;
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

    /**
     * Resolves capability-based data for the given sections.
     *
     * The result is an array indexed by the section position in the input,
     * each entry containing the resolved value and the target field name
     * where the data should be injected inside the section data.
     *
     * @param array<int,PageSectionDto> $sections
     * @return array<int,array{target_field:string,value:mixed}>
     */
    private function resolveCapabilitiesForSections(array $sections): array
    {
        if ($sections === []) {
            return [];
        }

        $templateConfigs = [];

        foreach ($sections as $section) {
            $templateKey = $section->templateKey;

            if (isset($templateConfigs[$templateKey])) {
                continue;
            }

            $definition = $this->templateRegistry->find($templateKey);

            if ($definition === null || !$definition->hasDataSource()) {
                continue;
            }

            $dataSource = $definition->dataSource();

            if (!$dataSource instanceof TemplateDataSource || !$dataSource->isCapability()) {
                continue;
            }

            $templateConfigs[$templateKey] = [
                self::TEMPLATE_CONFIG_CAPABILITY_KEY => $dataSource->capabilityKey(),
                self::TEMPLATE_CONFIG_FIELD_PARAMETER_MAP_KEY => $dataSource->parameterMapping(),
                self::TEMPLATE_CONFIG_TARGET_FIELD_KEY => $dataSource->targetField(),
            ];
        }

        if ($templateConfigs === []) {
            return [];
        }

        $results = $this->sectionCapabilitiesDataFetcher->fetchForSections(
            $sections,
            $templateConfigs,
        );

        $mapped = [];

        foreach ($results as $index => $value) {
            if (!isset($sections[$index])) {
                continue;
            }

            $section = $sections[$index];
            $templateKey = $section->templateKey;

            $targetField = $templateConfigs[$templateKey][self::TEMPLATE_CONFIG_TARGET_FIELD_KEY]
                ?? self::DEFAULT_CAPABILITY_TARGET_FIELD;

            $mapped[$index] = [
                self::CAPABILITY_TARGET_FIELD_KEY => $targetField,
                self::CAPABILITY_VALUE_KEY => $value,
            ];
        }

        return $mapped;
    }
}
