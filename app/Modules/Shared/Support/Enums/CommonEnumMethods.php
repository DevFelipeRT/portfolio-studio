<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\Enums;

trait CommonEnumMethods {
    /**
     * Returns all key-value pairs for UI usage.
     *
     * @return array<string, string>
     */
    public static function options(): array
    {
        $options = [];

        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }

        return $options;
    }
}
