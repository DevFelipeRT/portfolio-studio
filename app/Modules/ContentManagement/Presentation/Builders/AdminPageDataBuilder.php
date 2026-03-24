<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Builders;

use App\Modules\ContentManagement\Application\Services\PageSectionService;
use App\Modules\ContentManagement\Application\Services\PageService;
use App\Modules\Shared\Support\Data\DataTransformer;

/**
 * Builds the administrative page payload used by the edit screen.
 */
final class AdminPageDataBuilder
{
    public function __construct(
        private readonly PageService $pageService,
        private readonly PageSectionService $pageSectionService,
    ) {
    }

    /**
     * @return array{
     *     page: array<string,mixed>,
     *     sections: array<int,array<string,mixed>>
     * }|array{}
     */
    public function build(int $pageId): array
    {
        $pageDto = $this->pageService->getById($pageId);

        if ($pageDto === null) {
            return [];
        }

        $sectionDtos = $this->pageSectionService->getByPageId($pageId);

        return [
            'page' => DataTransformer::transform($pageDto)
                ->toArray()
                ->toSnakeCase()
                ->result(),
            'sections' => $this->buildSectionsData($sectionDtos),
        ];
    }

    /**
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
}
