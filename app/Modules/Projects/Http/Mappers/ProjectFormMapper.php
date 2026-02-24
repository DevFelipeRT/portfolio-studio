<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Mappers;

/**
 * Maps transport-layer input (e.g. session flashed "old input") into the shape
 * expected by the Inertia project form pages.
 */
final class ProjectFormMapper
{
    /**
     * @param array<string, mixed> $project Output of ProjectMapper::toArray()
     * @param array<string, mixed> $oldInput
     * @return array{
     *   locale: string,
     *   confirm_swap: bool,
     *   name: string,
     *   summary: string,
     *   description: string,
     *   status: string,
     *   repository_url: string,
     *   live_url: string,
     *   display: bool,
     *   skill_ids: array<int,int>,
     *   images: array<int,array{file: null, alt: string}>
     * }
     */
    public static function fromEdit(array $project, array $oldInput): array
    {
        $confirmSwap = array_key_exists('confirm_swap', $oldInput)
            ? (bool) $oldInput['confirm_swap']
            : false;
        $display = array_key_exists('display', $oldInput)
            ? (bool) $oldInput['display']
            : (bool) ($project['display'] ?? false);

        $projectSkillIds = [];
        $skills = $project['skills'] ?? [];
        if (is_array($skills)) {
            foreach ($skills as $skill) {
                if (is_array($skill) && array_key_exists('id', $skill) && is_numeric($skill['id'])) {
                    $projectSkillIds[] = (int) $skill['id'];
                }
            }
        }

        $skillIds = array_key_exists('skill_ids', $oldInput)
            ? self::normalizeSkillIds($oldInput['skill_ids'])
            : $projectSkillIds;

        return [
            'locale' => (string) ($oldInput['locale'] ?? $project['locale'] ?? ''),
            'confirm_swap' => $confirmSwap,
            'name' => (string) ($oldInput['name'] ?? $project['name'] ?? ''),
            'summary' => (string) ($oldInput['summary'] ?? $project['summary'] ?? ''),
            'description' => (string) ($oldInput['description'] ?? $project['description'] ?? ''),
            'status' => (string) ($oldInput['status'] ?? $project['status'] ?? ''),
            'repository_url' => (string) ($oldInput['repository_url'] ?? $project['repository_url'] ?? ''),
            'live_url' => (string) ($oldInput['live_url'] ?? $project['live_url'] ?? ''),
            'display' => $display,
            'skill_ids' => $skillIds,
            'images' => self::normalizeImages($oldInput['images'] ?? []),
        ];
    }

    /**
     * @return array<int,int>
     */
    private static function normalizeSkillIds(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        $normalized = [];
        foreach ($value as $item) {
            if (is_int($item)) {
                $normalized[] = $item;
                continue;
            }

            if (is_string($item) && is_numeric($item)) {
                $normalized[] = (int) $item;
            }
        }

        return array_values(array_unique($normalized));
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

            $alt = (string) ($image['alt'] ?? '');
            $images[] = [
                'file' => null,
                'alt' => $alt,
            ];
        }

        return $images;
    }
}
