<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText;

final class LexicalJsonNormalizer
{
    /**
     * Normalizes any input into a JSON string compatible with Lexical editorState.
     *
     * - Empty string becomes an empty Lexical document.
     * - Valid Lexical JSON is returned as-is (trimmed).
     * - Plain text is wrapped into a minimal Lexical document.
     */
    public static function normalize(string $raw): string
    {
        $trimmed = trim($raw);

        if ($trimmed === '') {
            return self::encodeDocument('');
        }

        $decoded = self::tryDecodeJsonObject($trimmed);
        if ($decoded !== null && self::looksLikeLexicalDocument($decoded)) {
            // Keep original JSON (trimmed) to avoid rewriting formatting/ordering.
            return $trimmed;
        }

        return self::encodeDocument($raw);
    }

    private static function encodeDocument(string $text): string
    {
        $document = [
            'root' => [
                'children' => [
                    [
                        'children' => [
                            [
                                'detail' => 0,
                                'format' => 0,
                                'mode' => 'normal',
                                'style' => '',
                                'text' => $text,
                                'type' => 'text',
                                'version' => 1,
                            ],
                        ],
                        'direction' => null,
                        'format' => '',
                        'indent' => 0,
                        'type' => 'paragraph',
                        'version' => 1,
                        'textFormat' => 0,
                        'textStyle' => '',
                    ],
                ],
                'direction' => null,
                'format' => '',
                'indent' => 0,
                'type' => 'root',
                'version' => 1,
            ],
        ];

        $json = json_encode($document, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return $json !== false
            ? $json
            : '{\"root\":{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}';
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
