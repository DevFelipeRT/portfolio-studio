<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Capabilities\Providers;

use App\Modules\Projects\Application\Capabilities\Dtos\VisibleProjectItem;
use App\Modules\Projects\Application\Services\ProjectService;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public visible projects with images and technologies.
 */
final class VisibleProjects implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ProjectService $projectService,
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
            'Returns public visible projects with images and technologies, ordered by most recent creation date.',
            [
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<VisibleProjectItem>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     * @return array<int, array{
     *     id: int,
     *     name: string,
     *     short_description: ?string,
     *     long_description: ?string,
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
     *     technologies: array<int, array{id: int, name: string, category: string}>
     * }>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        $limit = $this->extractLimit($parameters);

        $projects = $this->projectService->visible();

        if ($limit !== null) {
            $projects = $projects->take($limit);
        }

        return $this->mapProjects($projects);
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
     * @param Collection<int,Project> $projects
     * @return array<int, array{
     *     id: int,
     *     name: string,
     *     short_description: ?string,
     *     long_description: ?string,
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
     *     technologies: array<int, array{id: int, name: string, category: string}>
     * }>
     */
    private function mapProjects(Collection $projects): array
    {
        return $projects
            ->map(
                static function (Project $project): array {
                    return VisibleProjectItem::fromModel($project)->toArray();
                }
            )
            ->values()
            ->all();
    }
}
