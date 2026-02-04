<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\Capabilities\Providers;

use App\Modules\Initiatives\Application\Capabilities\Dtos\VisibleInitiativeItem;
use App\Modules\Initiatives\Application\Services\InitiativeTranslationResolver;
use App\Modules\Initiatives\Application\UseCases\ListVisibleInitiatives\ListVisibleInitiatives;
use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public visible initiatives with their images.
 */
final class VisibleInitiatives implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListVisibleInitiatives $listVisibleInitiatives,
        private readonly InitiativeTranslationResolver $translationResolver,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'initiatives.visible.v1',
            'Returns public visible initiatives ordered by most recent start date.',
            [
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<VisibleInitiativeItem>',
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
     *     display: bool,
     *     start_date: ?string,
     *     end_date: ?string,
     *     images: array<int, array{
     *         id: int,
     *         url: string,
     *         alt: ?string,
     *         title: ?string,
     *         caption: ?string,
     *         position: ?int,
     *         is_cover: bool,
     *         owner_caption: ?string
     *     }>
     * }>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        $limit = $this->extractLimit($parameters);

        $locale = app()->getLocale();
        $fallbackLocale = app()->getFallbackLocale();
        $initiatives = $this->listVisibleInitiatives->handle($locale, $fallbackLocale);

        if ($limit !== null) {
            $initiatives = $initiatives->take($limit);
        }

        return $this->mapInitiatives($initiatives, $locale, $fallbackLocale);
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
     * @param Collection<int,Initiative> $initiatives
     * @return array<int, array{
     *     id: int,
     *     name: string,
     *     summary: ?string,
     *     description: ?string,
     *     display: bool,
     *     start_date: ?string,
     *     end_date: ?string,
     *     images: array<int, array{
     *         id: int,
     *         url: string,
     *         alt: ?string,
     *         title: ?string,
     *         caption: ?string,
     *         position: ?int,
     *         is_cover: bool,
     *         owner_caption: ?string
     *     }>
     * }>
     */
    private function mapInitiatives(
        Collection $initiatives,
        string $locale,
        ?string $fallbackLocale,
    ): array
    {
        return $initiatives
            ->map(
                function (Initiative $initiative) use ($locale, $fallbackLocale): array {
                    $name = $this->translationResolver->resolveName(
                        $initiative,
                        $locale,
                        $fallbackLocale,
                    );
                    $summary = $this->translationResolver->resolveSummary(
                        $initiative,
                        $locale,
                        $fallbackLocale,
                    );
                    $description = $this->translationResolver->resolveDescription(
                        $initiative,
                        $locale,
                        $fallbackLocale,
                    );

                    return VisibleInitiativeItem::fromModelWithTranslations(
                        $initiative,
                        $name,
                        $summary,
                        $description,
                    )->toArray();
                }
            )
            ->values()
            ->all();
    }
}
