<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Mapping\Mapper;
use App\Modules\Skills\Domain\Models\Skill;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Str;

final class SkillMapper extends Mapper
{
    protected static string $modelClass = Skill::class;

    protected static function map(mixed $model): array
    {
        /** @var Skill $skill */
        $skill = $model;

        return [
            'id' => $skill->id,
            'name' => $skill->name,
            'category' => $skill->category,
            'skill_category_id' => $skill->skill_category_id,
        ];
    }

    /**
     * Group skills by category for frontend.
     *
     * @param array<string, EloquentCollection<int, Skill>> $groups
     * @return array<int, array{id:string,title:string,skills:array<int,array{id:int,name:string}>}>
     */
    public static function groupedByCategory(array $groups): array
    {
        return collect($groups)
            ->map(function (EloquentCollection $group, string $category): array {
                /** @var Skill|null $firstSkill */
                $firstSkill = $group->first();
                $categoryName = $firstSkill?->category?->name ?? Str::title($category);

                return [
                    'id' => $category,
                    'title' => $categoryName,
                    'skills' => $group
                        ->sortBy('name')
                        ->values()
                        ->map(fn(Skill $skill) => [
                            'id' => $skill->id,
                            'name' => $skill->name,
                        ])
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }
}
