<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\CreateMessage;

use App\Modules\Mail\Application\Jobs\SendHostNotificationForMessage;
use App\Modules\Mail\Domain\Repositories\IMessageRepository;
use Illuminate\Support\Facades\Log;
use Throwable;

final class CreateMessage
{
    public function __construct(
        private readonly IMessageRepository $repository,
    ) {
    }

    public function handle(CreateMessageInput $input): CreateMessageOutput
    {
        $message = $this->repository->create([
            'name' => $input->name,
            'email' => $input->email,
            'message' => $input->message,
            'important' => false,
            'seen' => false,
        ]);

        try {
            SendHostNotificationForMessage::dispatch($message->id);
        } catch (Throwable $exception) {
            Log::warning('Failed to enqueue host notification for contact message.', [
                'message_id' => $message->id,
                'exception' => $exception,
            ]);
        }

        return new CreateMessageOutput(
            messageId: $message->id,
        );
    }
}
