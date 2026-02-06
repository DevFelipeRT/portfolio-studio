<?php

declare(strict_types=1);

namespace App\Modules\Projects\Application\Capabilities\Providers;

use App\Modules\Projects\Application\Capabilities\Dtos\VisibleProjectItem;
use App\Modules\Projects\Application\Services\ProjectTranslationResolver;
use App\Modules\Projects\Application\UseCases\ListVisibleProjects\ListVisibleProjects;
use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public visible projects with images and skills.
 */
final class VisibleProjects implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListVisibleProjects $listVisibleProjects,
        private readonly ProjectTranslationResolver $translationResolver,
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
            'array<VisibleProjectItem>',
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

        $projects = $this->listVisibleProjects->handle($locale, $fallbackLocale);

        if ($limit !== null) {
            $projects = $projects->take($limit);
        }

        return $this->mapProjects($projects, $locale, $fallbackLocale);
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

    /**
     * @param Collection<int,Project> $projects
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
    private function mapProjects(
        Collection $projects,
        string $locale,
        ?string $fallbackLocale,
    ): array
    {
        return $projects
            ->map(
                function (Project $project) use ($locale, $fallbackLocale): array {
                    $name = $this->translationResolver->resolveName(
                        $project,
                        $locale,
                        $fallbackLocale,
                    );
                    $summary = $this->translationResolver->resolveSummary(
                        $project,
                        $locale,
                        $fallbackLocale,
                    );
                    $description = $this->translationResolver->resolveDescription(
                        $project,
                        $locale,
                        $fallbackLocale,
                    );
                    $repositoryUrl = $this->translationResolver->resolveRepositoryUrl(
                        $project,
                        $locale,
                        $fallbackLocale,
                    );
                    $liveUrl = $this->translationResolver->resolveLiveUrl(
                        $project,
                        $locale,
                        $fallbackLocale,
                    );

                    return VisibleProjectItem::fromModelWithTranslations(
                        $project,
                        $name,
                        $summary,
                        $description,
                        $repositoryUrl,
                        $liveUrl,
                    )->toArray();
                }
            )
            ->values()
            ->all();
    }
}
