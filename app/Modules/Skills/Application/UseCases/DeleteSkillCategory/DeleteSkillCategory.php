<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillCategory;

use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class DeleteSkillCategory
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
    ) {
    }

    public function handle(DeleteSkillCategoryInput $input): DeleteSkillCategoryOutput
    {
        $category = $this->repository->findById($input->skillCategoryId);
        $this->repository->delete($category);

        return new DeleteSkillCategoryOutput(
            skillCategoryId: $category->id,
        );
    }
}
