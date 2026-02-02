<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkill;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class DeleteSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
    ) {
    }

    public function handle(Skill $skill): void
    {
        $this->repository->delete($skill);
    }
}
