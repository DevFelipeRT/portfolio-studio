<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\Normalizers;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use DateTimeInterface;
use InvalidArgumentException;

class DateNormalizer
{
    /**
     * Normalizes a mixed date/time input into a Carbon instance.
     *
     * Accepted inputs:
     * - Carbon or CarbonInterface instances.
     * - DateTimeInterface instances.
     * - Integer timestamps.
     * - String values parseable by Carbon::parse.
     *
     * @throws InvalidArgumentException When the input cannot be converted to a date.
     */
    public static function toCarbon(mixed $input): Carbon
    {
        if ($input instanceof Carbon) {
            return $input;
        }

        if ($input instanceof CarbonInterface) {
            return Carbon::instance($input);
        }

        if ($input instanceof DateTimeInterface) {
            return Carbon::instance($input);
        }

        if (is_int($input)) {
            return Carbon::createFromTimestamp($input);
        }

        if (is_string($input)) {
            $value = trim($input);

            if ($value === '') {
                throw new InvalidArgumentException('Empty string cannot be converted to a date.');
            }

            try {
                return Carbon::parse($value);
            } catch (\Throwable $exception) {
                throw new InvalidArgumentException(
                    sprintf('String "%s" cannot be converted to a date.', $value),
                    0,
                    $exception
                );
            }
        }

        throw new InvalidArgumentException(
            sprintf(
                'Unsupported date input of type "%s".',
                is_object($input) ? $input::class : gettype($input)
            )
        );
    }
}
