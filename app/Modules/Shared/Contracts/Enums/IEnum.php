<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Enums;

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
