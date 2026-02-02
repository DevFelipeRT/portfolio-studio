<?php

declare(strict_types=1);

namespace App\Modules\Skills\Infrastructure\Repositories;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Models\SkillTranslation;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

final class SkillTranslationRepository implements ISkillTranslationRepository
{
    public function listBySkill(Skill $skill): EloquentCollection
    {
        return $skill->translations()->orderBy('locale')->get();
    }

    public function findBySkillAndLocale(Skill $skill, string $locale): ?SkillTranslation
    {
        return $skill
            ->translations()
            ->where('locale', $locale)
            ->first();
    }

    public function create(Skill $skill, string $locale, string $name): SkillTranslation
    {
        return $skill->translations()->create([
            'locale' => $locale,
            'name' => $name,
        ]);
    }

    public function update(SkillTranslation $translation, string $name): SkillTranslation
    {
        $translation->update([
            'name' => $name,
        ]);

        return $translation;
    }

    public function delete(SkillTranslation $translation): void
    {
        $translation->delete();
    }
}
