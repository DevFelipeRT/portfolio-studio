<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Presenters;

use App\Modules\ContentManagement\Application\Capabilities\SectionCapabilitiesDataFetcher;
use App\Modules\ContentManagement\Application\Dtos\PageDto;
use App\Modules\ContentManagement\Application\Dtos\PageSectionDto;
use App\Modules\ContentManagement\Application\Mappers\TemplateDefinitionMapper;
use App\Modules\ContentManagement\Application\Services\ContentSettingsService;
use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use App\Modules\ContentManagement\Domain\Templates\TemplateDataSource;
use App\Modules\ContentManagement\Domain\Templates\TemplateRegistry;
use App\Modules\ContentManagement\Presentation\ViewModels\Public\PageRenderViewModel;
use App\Modules\Images\Domain\Models\Image;
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
    private const string SECTION_ID_KEY = 'id';

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
        private readonly ContentSettingsService $contentSettings,
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
     * Renders the configured home page for the given locale.
     *
     * Resolves the home slug from content settings and delegates to the
     * standard renderBySlugAndLocale pipeline.
     */
    public function renderHomeByLocale(
        string $locale,
        ?CarbonInterface $referenceTime = null,
        array $extraPayload = [],
    ): ?PageRenderViewModel {
        $homeSlug = $this->contentSettings->getHomeSlug();

        return $this->renderBySlugAndLocale(
            $homeSlug,
            $locale,
            $referenceTime,
            $extraPayload,
        );
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

        $sections = $this->enrichSectionsWithImages($sections);

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

    /**
     * Enriches rendered sections with image data resolved from attachments.
     *
     * @param array<int,array<string,mixed>> $sections
     * @return array<int,array<string,mixed>>
     */
    private function enrichSectionsWithImages(array $sections): array
    {
        if ($sections === []) {
            return $sections;
        }

        $sectionIds = [];

        foreach ($sections as $section) {
            $id = $section[self::SECTION_ID_KEY] ?? null;

            if (is_int($id)) {
                $sectionIds[] = $id;
            }
        }

        $sectionIds = array_values(array_unique($sectionIds));

        if ($sectionIds === []) {
            return $sections;
        }

        /** @var \Illuminate\Support\Collection<int,PageSection> $models */
        $models = PageSection::query()
            ->with('images')
            ->whereIn('id', $sectionIds)
            ->get()
            ->keyBy('id');

        foreach ($sections as $index => $section) {
            $id = $section[self::SECTION_ID_KEY] ?? null;

            if (!is_int($id)) {
                continue;
            }

            /** @var PageSection|null $model */
            $model = $models->get($id);

            if (!$model instanceof PageSection) {
                continue;
            }

            $templateKey = $section[self::SECTION_TEMPLATE_KEY] ?? null;

            if (!is_string($templateKey) || $templateKey === '') {
                continue;
            }

            $definition = $this->templateRegistry->find($templateKey);

            if ($definition === null) {
                continue;
            }

            $data = $section[self::SECTION_DATA_KEY] ?? [];

            if (!is_array($data)) {
                $data = [];
            }

            foreach ($definition->fields() as $field) {
                $type = $field->type();

                if ($type !== 'image' && $type !== 'image_gallery') {
                    continue;
                }

                $name = $field->name();

                $resolved = $this->resolveImagesForField($model, $name, $type);

                if ($resolved === null) {
                    $data[$name] = $type === 'image_gallery' ? [] : null;

                    continue;
                }

                $data[$name] = $resolved;
            }

            $section[self::SECTION_DATA_KEY] = $data;
            $sections[$index] = $section;
        }

        return $sections;
    }

    /**
     * Resolves image data for a single template field.
     *
     * @param PageSection $section
     * @param string $fieldName
     * @param string $fieldType
     * @return array<mixed>|array<int,array<string,mixed>>|null
     */
    private function resolveImagesForField(
        PageSection $section,
        string $fieldName,
        string $fieldType
    ): array|null {
        $images = $section->images
            ->filter(static function (Image $image) use ($fieldName): bool {
                /** @var object|null $pivot */
                $pivot = $image->pivot ?? null;

                if ($pivot === null) {
                    return false;
                }

                return $pivot->slot === $fieldName;
            })
            ->sortBy(static function (Image $image): int {
                /** @var object|null $pivot */
                $pivot = $image->pivot ?? null;

                $position = $pivot?->position ?? 0;

                return is_int($position) ? $position : 0;
            })
            ->values();

        if ($images->isEmpty()) {
            return null;
        }

        if ($fieldType === 'image') {
            /** @var Image $image */
            $image = $images->first();

            return $this->mapImageToViewArray($image);
        }

        $results = [];

        foreach ($images as $image) {
            if (!$image instanceof Image) {
                continue;
            }

            $results[] = $this->mapImageToViewArray($image);
        }

        return $results;
    }

    /**
     * Builds a public-facing image payload from the image model and its pivot.
     *
     * @return array{
     *     id: int,
     *     url: string,
     *     alt: ?string,
     *     title: ?string,
     *     caption: ?string,
     *     position: ?int,
     *     is_cover: bool,
     *     owner_caption: ?string
     * }
     */
    private function mapImageToViewArray(Image $image): array
    {
        /** @var object|null $pivot */
        $pivot = $image->pivot ?? null;

        $position = $pivot?->position ?? null;

        if (!is_int($position)) {
            $position = null;
        }

        $isCover = (bool) ($pivot->is_cover ?? false);
        $ownerCaption = $pivot?->caption ?? null;

        if (!is_string($ownerCaption)) {
            $ownerCaption = null;
        }

        return [
            'id' => $image->id,
            'url' => $image->url,
            'alt' => $image->alt_text,
            'title' => $image->image_title,
            'caption' => $image->caption,
            'position' => $position,
            'is_cover' => $isCover,
            'owner_caption' => $ownerCaption,
        ];
    }

}
