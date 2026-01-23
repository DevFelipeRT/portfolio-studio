<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Services;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;

final class ContactChannelValueNormalizer
{
    public function normalize(ContactChannelType $type, string $value): string
    {
        $raw = trim($value);

        return match ($type) {
            ContactChannelType::Email => strtolower($raw),
            ContactChannelType::Phone, ContactChannelType::WhatsApp => $this->normalizePhoneValue($raw),
            ContactChannelType::GitHub, ContactChannelType::LinkedIn => $this->normalizeHandleOrUrl($raw),
            ContactChannelType::Custom => $raw,
        };
    }

    private function normalizePhoneValue(string $raw): string
    {
        $hasPlus = str_starts_with($raw, '+');
        $digits = preg_replace('/[^0-9]/', '', $raw) ?? '';

        if ($digits === '') {
            return '';
        }

        return $hasPlus ? '+' . $digits : $digits;
    }

    private function normalizeHandleOrUrl(string $raw): string
    {
        $trimmed = trim($raw);

        if ($this->isUrl($trimmed)) {
            return $trimmed;
        }

        return ltrim($trimmed, '@');
    }

    private function isUrl(string $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }
}
