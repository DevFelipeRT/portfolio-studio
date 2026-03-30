<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\Presenters;

use App\Modules\Skills\Application\UseCases\CreateSkillCategoryTranslation\CreateSkillCategoryTranslationOutput;
use App\Modules\Skills\Application\UseCases\CreateSkillTranslation\CreateSkillTranslationOutput;
use App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations\ListSkillCategoryTranslationItem;
use App\Modules\Skills\Application\UseCases\ListSkillCategoryTranslations\ListSkillCategoryTranslationsOutput;
use App\Modules\Skills\Application\UseCases\ListSkillTranslations\ListSkillTranslationItem;
use App\Modules\Skills\Application\UseCases\ListSkillTranslations\ListSkillTranslationsOutput;
use App\Modules\Skills\Application\UseCases\UpdateSkillCategoryTranslation\UpdateSkillCategoryTranslationOutput;
use App\Modules\Skills\Application\UseCases\UpdateSkillTranslation\UpdateSkillTranslationOutput;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillCategoryTranslationViewModel;
use App\Modules\Skills\Presentation\ViewModels\Admin\SkillTranslationViewModel;

final class SkillTranslationJsonPresenter
{
    /**
     * @return array{data:array<int,array<string,mixed>>}
     */
    public function presentSkillList(ListSkillTranslationsOutput $output): array
    {
        return [
            'data' => array_map(
                static fn(ListSkillTranslationItem $item): array => SkillTranslationViewModel::fromOutput($item)->toArray(),
                $output->items,
            ),
        ];
    }

    /**
     * @return array{data:array<string,mixed>}
     */
    public function presentCreatedSkillTranslation(
        CreateSkillTranslationOutput $output,
    ): array {
        return [
            'data' => SkillTranslationViewModel::fromOutput($output)->toArray(),
        ];
    }

    /**
     * @return array{data:array<string,mixed>}
     */
    public function presentUpdatedSkillTranslation(
        UpdateSkillTranslationOutput $output,
    ): array {
        return [
            'data' => SkillTranslationViewModel::fromOutput($output)->toArray(),
        ];
    }

    /**
     * @return array{data:array<int,array<string,mixed>>}
     */
    public function presentCategoryList(
        ListSkillCategoryTranslationsOutput $output,
    ): array {
        return [
            'data' => array_map(
                static fn(ListSkillCategoryTranslationItem $item): array => SkillCategoryTranslationViewModel::fromOutput($item)->toArray(),
                $output->items,
            ),
        ];
    }

    /**
     * @return array{data:array<string,mixed>}
     */
    public function presentCreatedCategoryTranslation(
        CreateSkillCategoryTranslationOutput $output,
    ): array {
        return [
            'data' => SkillCategoryTranslationViewModel::fromOutput($output)->toArray(),
        ];
    }

    /**
     * @return array{data:array<string,mixed>}
     */
    public function presentUpdatedCategoryTranslation(
        UpdateSkillCategoryTranslationOutput $output,
    ): array {
        return [
            'data' => SkillCategoryTranslationViewModel::fromOutput($output)->toArray(),
        ];
    }
}
