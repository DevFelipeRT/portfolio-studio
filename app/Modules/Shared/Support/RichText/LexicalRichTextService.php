<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText;

use App\Modules\Shared\Contracts\RichText\IRichTextService;
use App\Modules\Shared\Support\RichText\Exceptions\RichTextValidationException;

final class LexicalRichTextService implements IRichTextService
{
    public function normalize(string $raw): string
    {
        return LexicalJsonNormalizer::normalize($raw);
    }

    public function prepareForPersistence(string $raw, string $field = 'description'): PreparedRichText
    {
        $maxBytes = (int) config('rich_text.max_payload_bytes', 64 * 1024 * 1024);

        $normalized = $this->normalize($raw);
        $bytes = $this->bytesLength($normalized);

        if ($bytes > $maxBytes) {
            throw RichTextValidationException::forBytes(
                field: $field,
                maxBytes: $maxBytes,
                actualBytes: $bytes,
            );
        }

        $plainText = $this->plainText($normalized);

        return new PreparedRichText(
            normalized: $normalized,
            plainText: $plainText,
            bytes: $bytes,
        );
    }

    public function plainText(string $raw): string
    {
        return LexicalPlainTextExtractor::extract($raw);
    }

    public function characterCount(string $raw): int
    {
        $plain = $this->plainText($raw);

        return $plain === '' ? 0 : mb_strlen($plain, 'UTF-8');
    }

    public function ensureMaxCharacters(string $raw, int $maxCharacters, string $field = 'description'): void
    {
        $count = $this->characterCount($raw);

        if ($count > $maxCharacters) {
            throw RichTextValidationException::forCharacters(
                field: $field,
                maxCharacters: $maxCharacters,
                actualCharacters: $count,
            );
        }
    }

    public function bytesLength(string $raw): int
    {
        return RichTextBytes::length($raw);
    }
}
