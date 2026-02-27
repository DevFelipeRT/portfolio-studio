<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Mappers;

/**
 * Maps transport-layer input (e.g. session flashed "old input") into the shape
 * expected by the Inertia skill form pages.
 */
final class SkillFormMapper
{
    /**
     * @param array<string, mixed> $skill Output of SkillMapper::map()
     * @param array<string, mixed> $oldInput
     * @return array{
     *   name: string,
     *   locale: string,
     *   confirm_swap: bool,
     *   skill_category_id: int|''
     * }
     */
    public static function fromEdit(array $skill, array $oldInput): array
    {
        $confirmSwap = array_key_exists('confirm_swap', $oldInput)
            ? (bool) $oldInput['confirm_swap']
            : false;

        return [
            'name' => (string) ($oldInput['name'] ?? $skill['name'] ?? ''),
            'locale' => (string) ($oldInput['locale'] ?? $skill['locale'] ?? ''),
            'confirm_swap' => $confirmSwap,
            'skill_category_id' => self::normalizeCategoryId(
                $oldInput['skill_category_id'] ?? $skill['skill_category_id'] ?? '',
            ),
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
