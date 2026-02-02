<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\Mappers;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;

final class SkillCategoryMapper
{
    /**
     * @return array<string,mixed>
     */
    public static function map(SkillCategoryDto $dto): array
    {
        return $dto->toArray();
    }

    /**
     * @param array<int,SkillCategoryDto> $items
     * @return array<int,array<string,mixed>>
     */
    public static function collection(array $items): array
    {
        return array_map(static fn(SkillCategoryDto $dto): array => $dto->toArray(), $items);
    }
}
