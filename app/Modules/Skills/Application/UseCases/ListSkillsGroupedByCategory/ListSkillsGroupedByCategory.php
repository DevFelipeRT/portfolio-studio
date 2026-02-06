<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkillsGroupedByCategory;

use App\Modules\Skills\Application\Capabilities\Dtos\VisibleSkillGroup;
use App\Modules\Skills\Application\Capabilities\Dtos\VisibleSkillItem;
use App\Modules\Skills\Application\Services\SkillTranslationResolver;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class ListSkillsGroupedByCategory
{
    public function __construct(
        private readonly ISkillRepository $repository,
        private readonly SkillTranslationResolver $translationResolver,
    ) {
    }

    /**
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     skills: array<int, array{id: int, name: string}>
     * }>
     */
    public function handle(?string $locale = null, ?string $fallbackLocale = null): array
    {
        $locale ??= app()->getLocale();
        $fallbackLocale ??= app()->getFallbackLocale();

        $skills = $this->repository->allWithCategoryAndTranslations(
            $locale,
            $fallbackLocale,
        );

        $groups = $skills->groupBy(
            static fn(Skill $skill): string => $skill->category?->slug ?? 'uncategorized',
        );

        return $this->mapGroups($groups, $locale, $fallbackLocale);
    }

    /**
     * @param Collection<string,EloquentCollection<int,Skill>> $groups
     * @return array<int, array{
     *     id: string,
     *     title: string,
     *     skills: array<int, array{id: int, name: string}>
     * }>
     */
    private function mapGroups(
        Collection $groups,
        string $locale,
        ?string $fallbackLocale,
    ): array {
        return $groups
            ->map(function (EloquentCollection $group, string $category) use ($locale, $fallbackLocale): array {
                /** @var Skill|null $firstSkill */
                $firstSkill = $group->first();
                $categoryName = $firstSkill?->category !== null
                    ? $this->translationResolver->resolveCategoryName(
                        $firstSkill->category,
                        $locale,
                        $fallbackLocale,
                    )
                    : Str::title($category);

                $items = $group
                    ->sortBy('name')
                    ->values()
                    ->map(function (Skill $skill) use ($locale, $fallbackLocale): VisibleSkillItem {
                        $skillName = $this->translationResolver->resolveSkillName(
                            $skill,
                            $locale,
                            $fallbackLocale,
                        );

                        return VisibleSkillItem::fromName($skill->id, $skillName);
                    })
                    ->all();

                $dto = VisibleSkillGroup::fromCategory($category, $categoryName, $items);

                return $dto->toArray();
            })
            ->values()
            ->all();
    }
}
