<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Mappers;

/**
 * Maps transport-layer input (e.g. session flashed "old input") into the shape
 * expected by the Inertia initiative form pages.
 */
final class InitiativeFormMapper
{
    /**
     * @param array<string, mixed> $initiative Output of InitiativeMapper::toArray()
     * @param array<string, mixed> $oldInput
     * @return array{
     *   locale: string,
     *   confirm_swap: bool,
     *   name: string,
     *   summary: string,
     *   description: string,
     *   display: bool,
     *   start_date: string|null,
     *   end_date: string|null,
     *   images: array<int,array{file: null, alt: string}>
     * }
     */
    public static function fromEdit(array $initiative, array $oldInput): array
    {
        $confirmSwap = array_key_exists('confirm_swap', $oldInput)
            ? (bool) $oldInput['confirm_swap']
            : false;
        $display = array_key_exists('display', $oldInput)
            ? (bool) $oldInput['display']
            : (bool) ($initiative['display'] ?? false);

        return [
            'locale' => (string) ($oldInput['locale'] ?? $initiative['locale'] ?? ''),
            'confirm_swap' => $confirmSwap,
            'name' => (string) ($oldInput['name'] ?? $initiative['name'] ?? ''),
            'summary' => (string) ($oldInput['summary'] ?? $initiative['summary'] ?? ''),
            'description' => (string) ($oldInput['description'] ?? $initiative['description'] ?? ''),
            'display' => $display,
            'start_date' => self::normalizeNullableDate($oldInput['start_date'] ?? $initiative['start_date'] ?? null),
            'end_date' => self::normalizeNullableDate($oldInput['end_date'] ?? $initiative['end_date'] ?? null),
            'images' => self::normalizeImages($oldInput['images'] ?? []),
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

    /**
     * @return array<int,array{file: null, alt: string}>
     */
    private static function normalizeImages(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        $images = [];
        foreach ($value as $image) {
            if (!is_array($image)) {
                continue;
            }

            $images[] = [
                'file' => null,
                'alt' => (string) ($image['alt'] ?? ''),
            ];
        }

        return $images;
    }
}
