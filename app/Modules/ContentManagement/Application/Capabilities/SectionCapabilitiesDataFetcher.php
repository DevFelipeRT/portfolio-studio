<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Capabilities;

use App\Modules\ContentManagement\Application\Dtos\PageSectionDto;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;

/**
 * Fetches data for page sections using capabilities defined in templates.
 *
 * This service translates section data and template configuration into
 * capability calls executed through the CapabilitiesGateway.
 */
class SectionCapabilitiesDataFetcher
{
    public function __construct(
        private readonly CapabilitiesGateway $gateway,
    ) {
    }

    /**
     * Fetches data for a single section using a capability.
     *
     * @param PageSectionDto $section Section DTO with data payload.
     * @param string $capabilityKey Capability key to be executed.
     * @param array<string,string> $fieldParameterMap Map of section data field name => capability parameter name.
     */
    public function fetchForSection(
        PageSectionDto $section,
        string $capabilityKey,
        array $fieldParameterMap = [],
        ?string $defaultLocale = null,
        ?ICapabilityContext $context = null,
    ): mixed {
        $parameters = $this->buildParametersFromSection($section, $fieldParameterMap, $defaultLocale);

        return $this->gateway->resolve($capabilityKey, $parameters, $context);
    }

    /**
     * Fetches data for multiple sections in a single batch call.
     *
     * @param array<int,PageSectionDto> $sections
     * @param array<string,array{capability:string,field_parameter_map?:array<string,string>}> $templateConfigs
     * @return array<int,mixed> Results aligned by section index.
     */
    public function fetchForSections(
        array $sections,
        array $templateConfigs,
        ?string $defaultLocale = null,
        ?ICapabilityContext $context = null,
    ): array {
        $requests = [];
        $indexMap = [];

        foreach ($sections as $index => $section) {
            $templateKey = $section->templateKey;

            if (!isset($templateConfigs[$templateKey])) {
                continue;
            }

            $config = $templateConfigs[$templateKey];

            if (empty($config['capability'])) {
                continue;
            }

            $capabilityKey = $config['capability'];
            $fieldParameterMap = $config['field_parameter_map'] ?? [];

            $parameters = $this->buildParametersFromSection($section, $fieldParameterMap, $defaultLocale);

            $indexMap[] = $index;

            $requests[] = [
                'key' => $capabilityKey,
                'parameters' => $parameters,
            ];
        }

        if ($requests === []) {
            return [];
        }

        $results = $this->gateway->resolveMany($requests, $context);
        $mappedResults = [];

        foreach ($results as $resultIndex => $value) {
            $sectionIndex = $indexMap[$resultIndex] ?? null;

            if ($sectionIndex === null) {
                continue;
            }

            $mappedResults[$sectionIndex] = $value;
        }

        return $mappedResults;
    }

    /**
     * Builds capability parameters from a section's data.
     *
     * @param PageSectionDto $section
     * @param array<string,string> $fieldParameterMap Map of section data field name => capability parameter name.
     * @return array<string,mixed>
     */
    private function buildParametersFromSection(
        PageSectionDto $section,
        array $fieldParameterMap,
        ?string $defaultLocale,
    ): array {
        $parameters = [];
        $data = $section->data ?? [];

        foreach ($fieldParameterMap as $fieldName => $parameterName) {
            if (!array_key_exists($fieldName, $data)) {
                continue;
            }

            $parameters[$parameterName] = $data[$fieldName];
        }

        if (!array_key_exists('locale', $parameters)) {
            $sectionLocale = $section->locale;
            $resolvedLocale = $sectionLocale ?: $defaultLocale;
            if (is_string($resolvedLocale) && $resolvedLocale !== '') {
                $parameters['locale'] = $resolvedLocale;
            }
        }

        return $parameters;
    }
}
