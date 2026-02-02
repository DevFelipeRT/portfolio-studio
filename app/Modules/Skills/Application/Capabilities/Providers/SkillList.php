<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Capabilities\Providers;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use App\Modules\Skills\Application\UseCases\ListSkills\ListSkills;

final class SkillList implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListSkills $listSkills,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'skills.list.v1',
            'Returns skills for admin consumption.',
            [],
            'array<SkillDto>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     * @return array<int, array<string,mixed>>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        $skills = $this->listSkills->handle();

        return array_map(static fn($dto): array => $dto->toArray(), $skills);
    }
}
