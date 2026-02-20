<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText;

final class PreparedRichText
{
    public function __construct(
        private readonly string $normalized,
        private readonly string $plainText,
        private readonly int $bytes,
    ) {
    }

    public function normalized(): string
    {
        return $this->normalized;
    }

    public function plainText(): string
    {
        return $this->plainText;
    }

    public function bytes(): int
    {
        return $this->bytes;
    }
}

