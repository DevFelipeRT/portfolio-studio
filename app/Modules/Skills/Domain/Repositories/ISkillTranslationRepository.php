<?php

declare(strict_types=1);

namespace App\Modules\Skills\Domain\Repositories;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Models\SkillTranslation;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

interface ISkillTranslationRepository
{
    /**
     * @return EloquentCollection<int,SkillTranslation>
     */
    public function listBySkill(Skill $skill): EloquentCollection;

    public function findBySkillAndLocale(Skill $skill, string $locale): ?SkillTranslation;

    public function create(Skill $skill, string $locale, string $name): SkillTranslation;

    public function update(SkillTranslation $translation, string $name): SkillTranslation;

    public function delete(SkillTranslation $translation): void;
}
