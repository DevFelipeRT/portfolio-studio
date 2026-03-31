<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\SetMessageImportant;

final readonly class SetMessageImportantInput
{
    public function __construct(
        public int $messageId,
        public bool $important,
    ) {
    }
}
