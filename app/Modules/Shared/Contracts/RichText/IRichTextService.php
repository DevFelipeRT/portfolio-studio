<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\RichText;

use App\Modules\Shared\Support\RichText\PreparedRichText;
use App\Modules\Shared\Support\RichText\Exceptions\RichTextValidationException;

interface IRichTextService
{
    /**
     * Returns a Lexical-compatible JSON document string.
     */
    public function normalize(string $raw): string;

    /**
     * Runs the shared technical pipeline for rich text persistence:
     *
     * 1) Normalize into Lexical-compatible JSON
     * 2) Enforce the configured max payload size (bytes)
     * 3) Extract visible/plain text (best effort)
     *
     * Uses config('rich_text.max_payload_bytes').
     *
     * @throws RichTextValidationException
     */
    public function prepareForPersistence(string $raw, string $field = 'description'): PreparedRichText;

    /**
     * Extracts visible/plain text from a Lexical JSON document or returns raw text.
     */
    public function plainText(string $raw): string;

    /**
     * Counts visible/plain text characters (Unicode code points).
     */
    public function characterCount(string $raw): int;

    /**
     * Ensures the visible/plain text character count does not exceed the given maximum.
     *
     * @throws RichTextValidationException
     */
    public function ensureMaxCharacters(string $raw, int $maxCharacters, string $field = 'description'): void;

    /**
     * Returns the payload size in bytes.
     */
    public function bytesLength(string $raw): int;
}
