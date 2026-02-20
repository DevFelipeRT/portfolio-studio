<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText;

final class LexicalPlainTextExtractor
{
    public static function extract(string $raw): string
    {
        $trimmed = trim($raw);
        if ($trimmed === '') {
            return '';
        }

        $decoded = self::tryDecodeJsonObject($raw);
        if ($decoded === null || !self::looksLikeLexicalDocument($decoded)) {
            return $raw;
        }

        $root = $decoded['root'];
        $children = is_array($root) ? ($root['children'] ?? null) : null;
        if (!is_array($children)) {
            return '';
        }

        $blocks = [];
        foreach ($children as $child) {
            if (!is_array($child)) {
                continue;
            }

            $text = self::collectText($child);
            $blocks[] = $text;
        }

        // Best-effort: join top-level blocks with newlines.
        return trim(implode("\n", $blocks));
    }

    /**
     * @param array<string,mixed> $node
     */
    private static function collectText(array $node): string
    {
        $type = $node['type'] ?? null;

        if ($type === 'text' && is_string($node['text'] ?? null)) {
            return (string) $node['text'];
        }

        $children = $node['children'] ?? null;
        if (!is_array($children)) {
            return '';
        }

        $parts = [];
        foreach ($children as $child) {
            if (is_array($child)) {
                $parts[] = self::collectText($child);
            }
        }

        return implode('', $parts);
    }

    /**
     * @return array<string,mixed>|null
     */
    private static function tryDecodeJsonObject(string $raw): ?array
    {
        $decoded = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return null;
        }

        /** @var array<string,mixed> $decoded */
        return $decoded;
    }

    /**
     * @param array<string,mixed> $decoded
     */
    private static function looksLikeLexicalDocument(array $decoded): bool
    {
        $root = $decoded['root'] ?? null;

        if (!is_array($root)) {
            return false;
        }

        return ($root['type'] ?? null) === 'root';
    }
}
