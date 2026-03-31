<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\DeleteMessage;

final readonly class DeleteMessageOutput
{
    public function __construct(
        public int $messageId,
    ) {
    }
}
