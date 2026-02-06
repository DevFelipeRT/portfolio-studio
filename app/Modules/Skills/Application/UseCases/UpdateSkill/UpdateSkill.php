<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkill;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class UpdateSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
    ) {
    }

    public function handle(Skill $skill, UpdateSkillInput $input): SkillDto
    {
        $updated = $this->repository->update($skill, [
            'name' => $input->name,
            'skill_category_id' => $input->skillCategoryId,
        ]);

        $categoryDto = null;
        if ($updated->category !== null) {
            $categoryDto = SkillCategoryDto::fromModel($updated->category);
        }

        return SkillDto::fromModel($updated, null, $categoryDto);
    }
}
