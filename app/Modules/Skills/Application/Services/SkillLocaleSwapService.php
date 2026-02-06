<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\Services;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use Illuminate\Support\Facades\DB;

final class SkillLocaleSwapService
{
    public function __construct(
        private readonly ISkillRepository $skills,
        private readonly ISkillTranslationRepository $translations,
    ) {
    }

    public function swap(Skill $skill, string $newLocale): Skill
    {
        return DB::transaction(function () use ($skill, $newLocale): Skill {
            $translation = $this->translations->findBySkillAndLocale($skill, $newLocale);

            if ($translation === null) {
                return $skill;
            }

            $oldLocale = $skill->locale;
            $baseName = $skill->name;
            $newName = $translation->name;

            $this->skills->update($skill, [
                'locale' => $newLocale,
                'name' => $newName,
            ]);

            $existingOldTranslation = $this->translations->findBySkillAndLocale($skill, $oldLocale);

            if ($existingOldTranslation !== null) {
                $this->translations->update($existingOldTranslation, $baseName);
            } else {
                $this->translations->create($skill, $oldLocale, $baseName);
            }

            $this->translations->delete($translation);

            return $skill->refresh();
        });
    }
}
