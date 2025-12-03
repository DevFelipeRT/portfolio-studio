<?php

declare(strict_types=1);

namespace App\Enums;

interface IEnum {
    /**
     * Returns a human readable label.
     */
    public function label(): string;

    /**
     * Returns all key-value pairs.
     *
     * @return array<string, string>
     */
    public static function options(): array;
}
