<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\SetMessageImportant;

use App\Modules\Mail\Domain\Repositories\IMessageRepository;

final class SetMessageImportant
{
    public function __construct(
        private readonly IMessageRepository $repository,
    ) {
    }

    public function handle(SetMessageImportantInput $input): SetMessageImportantOutput
    {
        $message = $this->repository->findById($input->messageId);
        $this->repository->update($message, [
            'important' => $input->important,
        ]);

        return new SetMessageImportantOutput(
            messageId: $message->id,
            important: $input->important,
        );
    }
}
