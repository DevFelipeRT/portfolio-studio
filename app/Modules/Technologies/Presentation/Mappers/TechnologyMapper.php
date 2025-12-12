<?php

declare(strict_types=1);

namespace App\Modules\Technologies\Presentation\Mappers;

use App\Modules\Shared\Abstractions\Base\Mapper;
use App\Modules\Technologies\Domain\Models\Technology;
use App\Modules\Technologies\Domain\Enums\TechnologyCategories;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class TechnologyMapper extends Mapper
{
    protected static string $modelClass = Technology::class;

    protected static function map(mixed $model): array
    {
        /** @var Technology $tech */
        $tech = $model;

        return [
            'id' => $tech->id,
            'name' => $tech->name,
            'category' => $tech->category,
        ];
    }

    /**
     * Group technologies by category for frontend.
     *
     * @param array<string, EloquentCollection<int, Technology>> $groups
     * @return array<int, array{id:string,title:string,technologies:array<int,array{id:int,name:string}>}>
     */
    public static function groupedByCategory(array $groups): array
    {
        return collect($groups)
            ->map(function (EloquentCollection $group, string $category): array {
                $enum = TechnologyCategories::from($category);

                return [
                    'id' => $enum->value,
                    'title' => $enum->label(),
                    'technologies' => $group
                        ->sortBy('name')
                        ->values()
                        ->map(fn(Technology $tech) => [
                            'id' => $tech->id,
                            'name' => $tech->name,
                        ])
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }
}
