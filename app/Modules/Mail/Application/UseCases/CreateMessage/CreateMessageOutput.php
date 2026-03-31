<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\CreateMessage;

final readonly class CreateMessageOutput
{
    public function __construct(
        public int $messageId,
    ) {
    }
}
