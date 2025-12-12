<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Strongly-typed identifier for logical layout slots.
 *
 * This value object represents named slots within a page layout
 * (for example "hero", "main", "sidebar" or "footer_callout").
 * It centralizes basic validation and normalization concerns.
 */
final class SlotName
{
    /**
     * Underlying slot name value.
     */
    private string $value;

    /**
     * Private constructor to enforce named constructors.
     */
    private function __construct(string $value)
    {
        $this->value = $this->normalize($value);
    }

    /**
     * Factory method to create a SlotName from a raw string.
     *
     * @throws InvalidArgumentException
     */
    public static function fromString(string $value): self
    {
        $trimmed = trim($value);

        if ($trimmed === '') {
            throw new InvalidArgumentException('Slot name must not be empty.');
        }

        return new self($trimmed);
    }

    /**
     * Returns the normalized string representation of the slot name.
     */
    public function value(): string
    {
        return $this->value;
    }

    /**
     * Compares two SlotName instances by value.
     */
    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    /**
     * String casting helper.
     */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * Applies a simple normalization strategy to the slot name.
     *
     * Normalization rules are intentionally minimal here and can be
     * adjusted later if needed.
     */
    private function normalize(string $value): string
    {
        return trim($value);
    }
}
