<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Http\Mappers;

/**
 * Maps transport-layer input (e.g. session flashed "old input") into the shape
 * expected by the Inertia experience form pages.
 */
final class ExperienceFormMapper
{
    /**
     * @param array<string, mixed> $experience Output of ExperienceMapper::toArray()
     * @param array<string, mixed> $oldInput
     * @return array{
     *   locale: string,
     *   confirm_swap: bool,
     *   position: string,
     *   company: string,
     *   summary: string,
     *   description: string,
     *   start_date: string,
     *   end_date: string,
     *   display: bool
     * }
     */
    public static function fromEdit(array $experience, array $oldInput): array
    {
        $confirmSwap = array_key_exists('confirm_swap', $oldInput)
            ? (bool) $oldInput['confirm_swap']
            : false;
        $display = array_key_exists('display', $oldInput)
            ? (bool) $oldInput['display']
            : (bool) ($experience['display'] ?? false);

        return [
            'locale' => (string) ($oldInput['locale'] ?? $experience['locale'] ?? ''),
            'confirm_swap' => $confirmSwap,
            'position' => (string) ($oldInput['position'] ?? $experience['position'] ?? ''),
            'company' => (string) ($oldInput['company'] ?? $experience['company'] ?? ''),
            'summary' => (string) ($oldInput['summary'] ?? $experience['summary'] ?? ''),
            'description' => (string) ($oldInput['description'] ?? $experience['description'] ?? ''),
            'start_date' => (string) ($oldInput['start_date'] ?? $experience['start_date'] ?? ''),
            'end_date' => (string) ($oldInput['end_date'] ?? $experience['end_date'] ?? ''),
            'display' => $display,
        ];
    }
}
