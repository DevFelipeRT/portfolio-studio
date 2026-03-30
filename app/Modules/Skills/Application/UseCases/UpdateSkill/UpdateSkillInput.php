<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkill;

final readonly class UpdateSkillInput
{
    public function __construct(
        public readonly int $skillId,
        public readonly string $name,
        public readonly string $locale,
        public readonly bool $confirmSwap,
        public readonly ?int $skillCategoryId,
    ) {
    }
}
