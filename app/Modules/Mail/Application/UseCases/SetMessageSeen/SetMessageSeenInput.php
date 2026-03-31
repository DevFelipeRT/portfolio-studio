<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\SetMessageSeen;

final readonly class SetMessageSeenInput
{
    public function __construct(
        public int $messageId,
        public bool $seen,
    ) {
    }
}
