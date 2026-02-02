<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Services;

use Illuminate\Support\Str;

final class SkillCategorySlugNormalizer
{
    public function normalize(string $name, ?string $slug = null): string
    {
        $value = $slug !== null && $slug !== '' ? $slug : $name;

        return Str::slug($value);
    }
}
