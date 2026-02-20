<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText;

final class RichTextBytes
{
    public static function length(string $raw): int
    {
        return strlen($raw);
    }
}

