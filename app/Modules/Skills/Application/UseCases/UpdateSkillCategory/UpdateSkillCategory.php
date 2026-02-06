<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkillCategory;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillCategorySlugNormalizer;
use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class UpdateSkillCategory
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
        private readonly SkillCategorySlugNormalizer $slugNormalizer,
    ) {
    }

    public function handle(
        SkillCategory $category,
        UpdateSkillCategoryInput $input,
    ): SkillCategoryDto {
        $updated = $this->repository->update($category, [
            'name' => $input->name,
            'slug' => $this->slugNormalizer->normalize($input->name, $input->slug),
        ]);

        return SkillCategoryDto::fromModel($updated);
    }
}
