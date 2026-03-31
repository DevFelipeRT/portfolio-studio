<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Capabilities\Providers;

use App\Modules\Projects\Application\UseCases\ListVisibleProjects\ListVisibleProjects;
use App\Modules\Projects\Application\UseCases\ListVisibleProjects\ListVisibleProjectsInput;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;

/**
 * Capability provider that exposes public visible projects with images and skills.
 */
final class VisibleProjects implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListVisibleProjects $listVisibleProjects,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'projects.visible.v1',
            'Returns public visible projects with images and skills, ordered by most recent creation date.',
            [
                'locale' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => null,
                ],
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<ListVisibleProjectItem>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     * @return array<int, array{
     *     id: int,
     *     name: string,
     *     summary: ?string,
     *     description: ?string,
     *     repository_url: ?string,
     *     live_url: ?string,
     *     display: bool,
     *     images: array<int, array{
     *         id: int,
     *         url: string,
     *         alt: ?string,
     *         title: ?string,
     *         caption: ?string,
     *         position: ?int,
     *         is_cover: bool,
     *         owner_caption: ?string
     *     }>,
     *     skills: array<int, array{
     *         id: int,
     *         name: string,
     *         category: ?array{id: int, name: string, slug: string},
     *         skill_category_id: ?int
     *     }>
     * }>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        $limit = $this->extractLimit($parameters);
        $locale = $this->resolveLocale($parameters);
        $fallbackLocale = app()->getFallbackLocale();

        return $this->listVisibleProjects->handle(
            new ListVisibleProjectsInput(
                locale: $locale,
                fallbackLocale: $fallbackLocale,
                limit: $limit,
            ),
        )->toArray();
    }

    /**
     * @param array<string, mixed> $parameters
     */
    private function extractLimit(array $parameters): ?int
    {
        if (!\array_key_exists('limit', $parameters)) {
            return null;
        }

        $rawLimit = $parameters['limit'];

        if ($rawLimit === null) {
            return null;
        }

        if (\is_int($rawLimit)) {
            return $rawLimit > 0 ? $rawLimit : null;
        }

        if (\is_numeric($rawLimit)) {
            $value = (int) $rawLimit;

            return $value > 0 ? $value : null;
        }

        return null;
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
