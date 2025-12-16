<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Capabilities\Providers;

use App\Modules\Experiences\Application\Capabilities\Dtos\VisibleExperienceItem;
use App\Modules\Experiences\Application\Services\ExperienceService;
use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public visible experiences.
 */
final class VisibleExperiences implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ExperienceService $experienceService,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition === null) {
            $this->definition = $this->createDefinition();
        }

        return $this->definition;
    }

    /**
     * Executes the capability and returns the resolved payload.
     *
     * @param array<string, mixed> $parameters
     */
    public function execute(array $parameters, ?ICapabilityContext $context = null): mixed
    {
        $limit = $parameters['limit'] ?? null;

        /** @var Collection<int, Experience> $experiences */
        $experiences = $this->experienceService->visible();

        if (\is_int($limit) && $limit > 0) {
            $experiences = $experiences->take($limit);
        }

        return $experiences
            ->map(
                static fn(Experience $experience): array => VisibleExperienceItem::fromModel(
                    $experience
                )->toArray()
            )
            ->values()
            ->all();
    }

    private function createDefinition(): ICapabilityDefinition
    {
        return $this->capabilitiesFactory->createPublicDefinition(
            'experiences.visible.v1',
            'Returns public visible experiences ordered by most recent start date.',
            [
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<VisibleExperienceItem>',
        );
    }
}
