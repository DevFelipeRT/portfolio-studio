<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\Mappers;

use App\Modules\Mail\Application\UseCases\ListMessages\ListMessageItem;
use App\Modules\Mail\Domain\Models\Message;

final class MessageAdminOutputMapper
{
    public function toListMessageItem(Message $message): ListMessageItem
    {
        return new ListMessageItem(
            id: $message->id,
            name: $message->name,
            email: $message->email,
            message: $message->message,
            important: (bool) $message->important,
            seen: (bool) $message->seen,
            createdAt: $message->created_at?->toJSON(),
        );
    }
}
