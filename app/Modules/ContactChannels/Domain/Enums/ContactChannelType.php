<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Domain\Enums;

/**
 * Supported contact channel types for the website.
 */
enum ContactChannelType: string
{
    case Email = 'email';
    case Phone = 'phone';
    case WhatsApp = 'whatsapp';
    case LinkedIn = 'linkedin';
    case GitHub = 'github';
    case Custom = 'custom';

    /**
     * Returns true when the channel type is custom.
     */
    public function isCustom(): bool
    {
        return $this === self::Custom;
    }
}
