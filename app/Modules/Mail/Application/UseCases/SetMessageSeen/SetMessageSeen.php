<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\SetMessageSeen;

use App\Modules\Mail\Domain\Repositories\IMessageRepository;

final class SetMessageSeen
{
    public function __construct(
        private readonly IMessageRepository $repository,
    ) {
    }

    public function handle(SetMessageSeenInput $input): SetMessageSeenOutput
    {
        $message = $this->repository->findById($input->messageId);
        $this->repository->update($message, [
            'seen' => $input->seen,
        ]);

        return new SetMessageSeenOutput(
            messageId: $message->id,
            seen: $input->seen,
        );
    }
}
