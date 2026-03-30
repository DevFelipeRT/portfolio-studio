<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\ListSkills;

use App\Modules\Skills\Application\Mappers\SkillAdminOutputMapper;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Models\Skill;

final class ListSkills
{
    public function __construct(
        private readonly ISkillRepository $repository,
        private readonly SkillAdminOutputMapper $skillAdminOutputMapper,
    ) {
    }

    public function handle(ListSkillsInput $input): ListSkillsOutput
    {
        $skills = $this->repository->paginateWithCategory(
            perPage: $input->perPage,
            page: $input->page,
            search: $input->search,
            categoryId: $input->categoryId,
            sort: $input->sort,
            direction: $input->direction,
        );

        return new ListSkillsOutput(
            items: array_map(
                fn(Skill $skill): ListSkillItem => $this->skillAdminOutputMapper->toListSkillItem($skill),
                $skills->items(),
            ),
            currentPage: $skills->currentPage(),
            lastPage: $skills->lastPage(),
            perPage: $skills->perPage(),
            from: $skills->firstItem(),
            to: $skills->lastItem(),
            total: $skills->total(),
            path: $skills->path(),
            links: $skills->linkCollection()
                ->map(static fn(array $link): array => [
                    'url' => $link['url'],
                    'label' => (string) $link['label'],
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
        );
    }

    /**
     * @return array<int,ListSkillItem>
     */
    public function all(
        ?string $locale = null,
        ?string $fallbackLocale = null,
        bool $useTranslations = false,
    ): array
    {
        if ($useTranslations) {
            $locale ??= app()->getLocale();
            $fallbackLocale ??= app()->getFallbackLocale();

            $skills = $this->repository->allWithCategoryAndTranslations(
                $locale,
                $fallbackLocale,
            );

            return $skills
                ->map(fn($skill): ListSkillItem => $this->skillAdminOutputMapper->toListSkillItem(
                    $skill,
                    $locale,
                    $fallbackLocale,
                    true,
                ))
                ->all();
        }

        $skills = $this->repository->allWithCategory();

        return $skills
            ->map(fn($skill): ListSkillItem => $this->skillAdminOutputMapper->toListSkillItem($skill))
            ->all();
    }
}
