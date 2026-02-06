<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\CreateSkillCategory;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Services\SkillCategorySlugNormalizer;
use App\Modules\Skills\Domain\Repositories\ISkillCategoryRepository;

final class CreateSkillCategory
{
    public function __construct(
        private readonly ISkillCategoryRepository $repository,
        private readonly SkillCategorySlugNormalizer $slugNormalizer,
    ) {
    }

    public function handle(CreateSkillCategoryInput $input): SkillCategoryDto
    {
        $category = $this->repository->create([
            'name' => $input->name,
            'slug' => $this->slugNormalizer->normalize($input->name, $input->slug),
            'locale' => $input->locale,
        ]);

        return SkillCategoryDto::fromModel($category);
    }
}
