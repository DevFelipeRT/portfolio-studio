<?php

declare(strict_types=1);

namespace App\Modules\Technologies\Application\Capabilities\Providers;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use App\Modules\Technologies\Application\Capabilities\Dtos\VisibleTechnologyGroup;
use App\Modules\Technologies\Application\Capabilities\Dtos\VisibleTechnologyItem;
use App\Modules\Technologies\Application\Services\TechnologyService;
use App\Modules\Technologies\Domain\Enums\TechnologyCategories;
use App\Modules\Technologies\Domain\Models\Technology;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public technologies grouped by category.
 */
final class TechnologiesByCategory implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly TechnologyService $technologyService,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'technologies.grouped_by_category.v1',
            'Returns portfolio technologies grouped by category.',
            [],
            'array<VisibleTechnologyGroup>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     technologies: array<int, array{id: int, name: string}>
     * }>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        $groups = $this->technologyService->groupedByCategory();

        return $this->mapGroups($groups);
    }

    /**
     * @param Collection<string,EloquentCollection<int,Technology>> $groups
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     technologies: array<int, array{id: int, name: string}>
     * }>
     */
    private function mapGroups(Collection $groups): array
    {
        return $groups
            ->map(
                static function (EloquentCollection $group, string $category): array {
                    $enum = TechnologyCategories::from($category);

                    $items = $group
                        ->sortBy('name')
                        ->values()
                        ->map(
                            static function (Technology $technology): VisibleTechnologyItem {
                                return VisibleTechnologyItem::fromModel($technology);
                            },
                        )
                        ->all();

                    $dto = VisibleTechnologyGroup::fromCategoryEnum($enum, $items);

                    return $dto->toArray();
                },
            )
            ->values()
            ->all();
    }
}
