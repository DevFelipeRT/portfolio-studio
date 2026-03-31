<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\ListMessages;

final readonly class ListMessagesInput
{
    public function __construct(
        public int $perPage = 15,
        public int $page = 1,
        public ?string $search = null,
        public ?string $seen = null,
        public ?string $important = null,
        public ?string $sort = null,
        public ?string $direction = null,
    ) {
    }
}
