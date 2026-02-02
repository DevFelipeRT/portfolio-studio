<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\DeleteSkillCategory;

use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class DeleteSkillCategory
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
    ) {
    }

    public function handle(SkillCategory $category): void
    {
        $this->repository->delete($category);
    }
}
