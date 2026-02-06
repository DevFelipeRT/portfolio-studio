<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Capabilities\Providers;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use App\Modules\Skills\Application\UseCases\ListSkillsGroupedByCategory\ListSkillsGroupedByCategory;

/**
 * Capability provider that exposes public skills grouped by category.
 */
final class SkillsByCategory implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListSkillsGroupedByCategory $listSkillsGroupedByCategory,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'skills.grouped_by_category.v1',
            'Returns portfolio skills grouped by category.',
            [
                'locale' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => null,
                ],
            ],
            'array<VisibleSkillGroup>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     skills: array<int, array{id: int, name: string}>
     * }>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        $locale = $this->resolveLocale($parameters);
        $fallbackLocale = app()->getFallbackLocale();

        return $this->listSkillsGroupedByCategory->handle($locale, $fallbackLocale);
    }

    /**
     * @param array<string, mixed> $parameters
     */
    private function resolveLocale(array $parameters): string
    {
        $locale = $parameters['locale'] ?? null;

        if (\is_string($locale)) {
            $trimmed = trim($locale);
            if ($trimmed !== '') {
                return $trimmed;
            }
        }

        return app()->getLocale();
    }
}
