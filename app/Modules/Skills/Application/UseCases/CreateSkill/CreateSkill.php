<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkill;

use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class CreateSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
    ) {
    }

    public function handle(CreateSkillInput $input): SkillDto
    {
        $skill = $this->repository->create([
            'name' => $input->name,
            'locale' => $input->locale,
            'skill_category_id' => $input->skillCategoryId,
        ]);

        $categoryDto = null;
        if ($skill->category !== null) {
            $categoryDto = SkillCategoryDto::fromModel($skill->category);
        }

        return SkillDto::fromModel($skill, null, $categoryDto);
    }
}
