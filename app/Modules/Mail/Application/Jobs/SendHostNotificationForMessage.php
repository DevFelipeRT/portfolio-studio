<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\Jobs;

use App\Modules\Mail\Application\Services\MessageService;
use App\Modules\Mail\Domain\Repositories\IMessageRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SendHostNotificationForMessage implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    /**
     * @var array<int,int>
     */
    public array $backoff = [60, 300, 900];

    public function __construct(
        public readonly int $messageId,
    ) {
        $this->afterCommit();
    }

    public function handle(
        IMessageRepository $repository,
        MessageService $messageService,
    ): void {
        $message = $repository->findById($this->messageId);

        $messageService->sendHostNotification($message);
    }

    public function failed(Throwable $exception): void
    {
        Log::warning('Failed to send host notification for contact message.', [
            'message_id' => $this->messageId,
            'exception' => $exception,
        ]);
    }
}
