<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkill;

final class UpdateSkillInput
{
    public function __construct(
        public readonly string $name,
        public readonly string $locale,
        public readonly ?int $skillCategoryId,
    ) {
    }
}
