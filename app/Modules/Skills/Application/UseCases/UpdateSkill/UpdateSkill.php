<?php

declare(strict_types=1);

namespace App\Modules\Skills\Application\UseCases\UpdateSkill;

use App\Modules\Skills\Application\Dtos\SkillCategoryDto;
use App\Modules\Skills\Application\Dtos\SkillDto;
use App\Modules\Skills\Application\Services\SkillLocaleSwapService;
use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Repositories\ISkillRepository;
use App\Modules\Skills\Domain\Repositories\ISkillTranslationRepository;
use Illuminate\Support\Facades\DB;

final class UpdateSkill
{
    public function __construct(
        private readonly ISkillRepository $repository,
        private readonly ISkillTranslationRepository $translations,
        private readonly SkillLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(Skill $skill, UpdateSkillInput $input): SkillDto
    {
        $updated = DB::transaction(function () use ($skill, $input): Skill {
            $localeChanged = $input->locale !== $skill->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findBySkillAndLocale(
                    $skill,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $skill = $this->localeSwapService->swap($skill, $input->locale);
            } else {
                $this->repository->update($skill, [
                    'name' => $input->name,
                    'locale' => $input->locale,
                ]);
            }

            return $this->repository->update($skill, [
                'skill_category_id' => $input->skillCategoryId,
            ]);
        });

        $categoryDto = null;
        if ($updated->category !== null) {
            $categoryDto = SkillCategoryDto::fromModel($updated->category);
        }

        return SkillDto::fromModel($updated, null, $categoryDto);
    }
}
