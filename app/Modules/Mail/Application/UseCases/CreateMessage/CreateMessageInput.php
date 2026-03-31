<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\CreateMessage;

final readonly class CreateMessageInput
{
    public function __construct(
        public string $name,
        public string $email,
        public string $message,
    ) {
    }
}
