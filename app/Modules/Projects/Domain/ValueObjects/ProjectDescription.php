<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\ValueObjects;

use App\Modules\Projects\Domain\Exceptions\ProjectDescriptionTooLongException;

final class ProjectDescription
{
    public const CHARACTER_LIMIT = 10000;

    private function __construct(
        private readonly string $raw,
        private readonly string $plainText,
    ) {
    }

    public static function fromRawAndPlainText(
        string $raw,
        string $plainText,
    ): self {
        $count = $plainText === '' ? 0 : mb_strlen($plainText, 'UTF-8');

        if ($count > self::CHARACTER_LIMIT) {
            throw new ProjectDescriptionTooLongException(
                limit: self::CHARACTER_LIMIT,
                actual: $count,
            );
        }

        return new self($raw, $plainText);
    }

    public function raw(): string
    {
        return $this->raw;
    }

    public function plainText(): string
    {
        return $this->plainText;
    }
}
