<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Capabilities\Providers;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use App\Modules\Skills\Application\Capabilities\Dtos\VisibleSkillGroup;
use App\Modules\Skills\Application\Capabilities\Dtos\VisibleSkillItem;
use App\Modules\Skills\Application\Services\SkillService;
use App\Modules\Skills\Domain\Models\Skill;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Capability provider that exposes public skills grouped by category.
 */
final class SkillsByCategory implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly SkillService $skillService,
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
            [],
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
        $groups = $this->skillService->groupedByCategory();

        return $this->mapGroups($groups);
    }

    /**
     * @param Collection<string,EloquentCollection<int,Skill>> $groups
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     skills: array<int, array{id: int, name: string}>
     * }>
     */
    private function mapGroups(Collection $groups): array
    {
        return $groups
            ->map(
                static function (EloquentCollection $group, string $category): array {
                    /** @var Skill|null $firstSkill */
                    $firstSkill = $group->first();
                    $categoryName = $firstSkill?->category?->name ?? Str::title($category);

                    $items = $group
                        ->sortBy('name')
                        ->values()
                        ->map(
                            static function (Skill $skill): VisibleSkillItem {
                                return VisibleSkillItem::fromModel($skill);
                            },
                        )
                        ->all();

                    $dto = VisibleSkillGroup::fromCategory($category, $categoryName, $items);

                    return $dto->toArray();
                },
            )
            ->values()
            ->all();
    }
}
