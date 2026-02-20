<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText\Exceptions;

use InvalidArgumentException;

final class RichTextValidationException extends InvalidArgumentException
{
    public const KIND_BYTES = 'bytes';
    public const KIND_CHARACTERS = 'characters';

    /**
     * @param array<string,mixed> $meta
     */
    private function __construct(
        private readonly string $field,
        private readonly string $kind,
        string $message,
        private readonly array $meta = [],
    ) {
        parent::__construct($message);
    }

    /**
     * @param array<string,mixed> $meta
     */
    public static function forBytes(string $field, int $maxBytes, ?int $actualBytes = null, array $meta = []): self
    {
        return new self(
            field: $field,
            kind: self::KIND_BYTES,
            message: sprintf(
                'The %s field exceeds the maximum supported payload size (%d bytes).',
                str_replace('_', ' ', $field),
                $maxBytes,
            ),
            meta: array_merge($meta, [
                'limit' => $maxBytes,
                'actual' => $actualBytes,
            ]),
        );
    }

    /**
     * @param array<string,mixed> $meta
     */
    public static function forCharacters(string $field, int $maxCharacters, ?int $actualCharacters = null, array $meta = []): self
    {
        return new self(
            field: $field,
            kind: self::KIND_CHARACTERS,
            message: sprintf(
                'The %s field may not be greater than %d characters.',
                str_replace('_', ' ', $field),
                $maxCharacters,
            ),
            meta: array_merge($meta, [
                'limit' => $maxCharacters,
                'actual' => $actualCharacters,
            ]),
        );
    }

    public function field(): string
    {
        return $this->field;
    }

    public function kind(): string
    {
        return $this->kind;
    }

    /**
     * @return array<string,mixed>
     */
    public function meta(): array
    {
        return $this->meta;
    }
}

