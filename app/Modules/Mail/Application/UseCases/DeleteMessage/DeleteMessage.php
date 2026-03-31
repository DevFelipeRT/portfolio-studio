<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\DeleteMessage;

use App\Modules\Mail\Domain\Repositories\IMessageRepository;

final class DeleteMessage
{
    public function __construct(
        private readonly IMessageRepository $repository,
    ) {
    }

    public function handle(DeleteMessageInput $input): DeleteMessageOutput
    {
        $message = $this->repository->findById($input->messageId);
        $this->repository->delete($message);

        return new DeleteMessageOutput(
            messageId: $message->id,
        );
    }
}
