<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Mappers;

/**
 * Maps transport-layer input (e.g. session flashed "old input") into the shape
 * expected by the Inertia course form pages.
 */
final class CourseFormMapper
{
    /**
     * @param array<string, mixed> $course Output of CourseMapper::toArray()
     * @param array<string, mixed> $oldInput
     * @return array{
     *   locale: string,
     *   confirm_swap: bool,
     *   name: string,
     *   institution: string,
     *   category: string,
     *   summary: string,
     *   description: string,
     *   started_at: string|null,
     *   completed_at: string|null,
     *   display: bool
     * }
     */
    public static function fromEdit(array $course, array $oldInput): array
    {
        $confirmSwap = array_key_exists('confirm_swap', $oldInput)
            ? (bool) $oldInput['confirm_swap']
            : false;
        $display = array_key_exists('display', $oldInput)
            ? (bool) $oldInput['display']
            : (bool) ($course['display'] ?? false);

        return [
            'locale' => (string) ($oldInput['locale'] ?? $course['locale'] ?? ''),
            'confirm_swap' => $confirmSwap,
            'name' => (string) ($oldInput['name'] ?? $course['name'] ?? ''),
            'institution' => (string) ($oldInput['institution'] ?? $course['institution'] ?? ''),
            'category' => (string) ($oldInput['category'] ?? $course['category'] ?? ''),
            'summary' => (string) ($oldInput['summary'] ?? $course['summary'] ?? ''),
            'description' => (string) ($oldInput['description'] ?? $course['description'] ?? ''),
            'started_at' => self::normalizeNullableDate($oldInput['started_at'] ?? $course['started_at'] ?? null),
            'completed_at' => self::normalizeNullableDate($oldInput['completed_at'] ?? $course['completed_at'] ?? null),
            'display' => $display,
        ];
    }

    private static function normalizeNullableDate(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            $trimmed = trim($value);
            return $trimmed === '' ? null : $trimmed;
        }

        return (string) $value;
    }
}
