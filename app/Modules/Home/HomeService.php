<?php

declare(strict_types=1);

namespace App\Modules\Home;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;

/**
 * Service used by the Home module to consume capabilities.
 */
final class HomeService
{
    public function __construct(
        private readonly ICapabilitiesFactory $capabilitiesFactory,
        private readonly ICapabilityDataResolver $dataResolver,
    ) {
    }

    /**
     * Loads visible experiences using the experiences.visible.v1 capability.
     *
     * @return array<int, array<string, mixed>>
     */
    public function loadVisibleExperiences(int $limit = 3): array
    {
        $key = $this->capabilitiesFactory->createKey('experiences.visible.v1');

        $result = $this->dataResolver->resolve(
            $key,
            [
                'limit' => $limit,
            ],
        );

        return \is_array($result) ? $result : [];
    }

    public function loadVisibleCourses(int $limit = 3): array
    {
        $key = $this->capabilitiesFactory->createKey('courses.visible.v1');

        $result = $this->dataResolver->resolve(
            $key,
            [
                'limit' => $limit,
            ],
        );

        return \is_array($result) ? $result : [];
    }

    /**
     * Load technologies grouped by category using the capabilities layer.
     *
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     technologies: array<int, array{id: int, name: string}>
     * }>
     */
    public function loadTechnologiesByCategory(): array
    {
        $key = $this->capabilitiesFactory->createKey(
            'technologies.grouped_by_category.v1',
        );

        $result = $this->dataResolver->resolve(
            $key,
            [],
        );

        return \is_array($result) ? $result : [];
    }
}
