<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillFormViewModel
{
    /**
     * @param int|'' $skillCategoryId
     */
    public function __construct(
        public string $name,
        public string $locale,
        public bool $confirmSwap,
        public int|string $skillCategoryId,
    ) {
    }

    /**
     * @param array<string,mixed> $oldInput
     */
    public static function empty(array $oldInput = []): self
    {
        return new self(
            name: (string) ($oldInput['name'] ?? ''),
            locale: (string) ($oldInput['locale'] ?? ''),
            confirmSwap: array_key_exists('confirm_swap', $oldInput)
                ? (bool) $oldInput['confirm_swap']
                : false,
            skillCategoryId: self::normalizeCategoryId(
                $oldInput['skill_category_id'] ?? '',
            ),
        );
    }

    /**
     * @param array<string,mixed> $oldInput
     */
    public static function fromSkill(
        SkillViewModel $skill,
        array $oldInput = [],
    ): self {
        return new self(
            name: (string) ($oldInput['name'] ?? $skill->name),
            locale: (string) ($oldInput['locale'] ?? $skill->locale),
            confirmSwap: array_key_exists('confirm_swap', $oldInput)
                ? (bool) $oldInput['confirm_swap']
                : false,
            skillCategoryId: self::normalizeCategoryId(
                $oldInput['skill_category_id'] ?? $skill->skillCategoryId,
            ),
        );
    }

    /**
     * @return array{
     *     name:string,
     *     locale:string,
     *     confirm_swap:bool,
     *     skill_category_id:int|''
     * }
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'locale' => $this->locale,
            'confirm_swap' => $this->confirmSwap,
            'skill_category_id' => $this->skillCategoryId,
        ];
    }

    private static function normalizeCategoryId(mixed $value): int|string
    {
        if ($value === null || $value === '') {
            return '';
        }

        if (is_int($value)) {
            return $value;
        }

        if (is_string($value) && is_numeric($value)) {
            return (int) $value;
        }

        return '';
    }
}
