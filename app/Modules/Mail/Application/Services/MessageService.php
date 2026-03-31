<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\Services;

use App\Modules\Mail\Domain\Models\Message;
use App\Modules\Mail\Domain\ValueObjects\ContactMessageReceived;

use Illuminate\Support\Facades\Mail;

final class MessageService
{
    public function sendHostNotification(Message $message): void
    {
        $recipient = config('mail.to.address');

        if (empty($recipient)) {
            return;
        }

        Mail::to($recipient)->send(
            new ContactMessageReceived($message)
        );
    }
}
