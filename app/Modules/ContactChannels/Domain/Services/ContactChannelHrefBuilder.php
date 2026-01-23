<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Domain\Services;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;

final class ContactChannelHrefBuilder
{
    public function build(ContactChannelType $type, string $value): string
    {
        return match ($type) {
            ContactChannelType::Email => 'mailto:' . $value,
            ContactChannelType::Phone => 'tel:' . $value,
            ContactChannelType::WhatsApp => $this->buildWhatsAppUrl($value),
            ContactChannelType::GitHub => $this->buildProfileUrl('https://github.com/', $value),
            ContactChannelType::LinkedIn => $this->buildProfileUrl('https://linkedin.com/in/', $value),
            ContactChannelType::Custom => $value,
        };
    }

    private function buildWhatsAppUrl(string $value): string
    {
        $digits = preg_replace('/[^0-9]/', '', $value) ?? '';

        return 'https://wa.me/' . $digits;
    }

    private function buildProfileUrl(string $prefix, string $value): string
    {
        if ($this->isUrl($value)) {
            return $value;
        }

        $handle = ltrim($value, '@');

        return $prefix . $handle;
    }

    private function isUrl(string $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }
}
