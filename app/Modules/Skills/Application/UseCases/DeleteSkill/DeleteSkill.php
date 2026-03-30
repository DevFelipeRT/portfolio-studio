<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkill;

use App\Modules\Skills\Domain\Repositories\ISkillRepository;

final class DeleteSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
    ) {
    }

    public function handle(DeleteSkillInput $input): DeleteSkillOutput
    {
        $skill = $this->repository->findById($input->skillId);
        $this->repository->delete($skill);

        return new DeleteSkillOutput(
            skillId: $skill->id,
        );
    }
}
