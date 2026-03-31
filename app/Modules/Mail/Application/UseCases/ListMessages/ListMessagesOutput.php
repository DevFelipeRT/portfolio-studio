<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\ListMessages;

final readonly class ListMessagesOutput
{
    /**
     * @param array<int,ListMessageItem> $items
     * @param array<int,array{url:string|null,label:string,active:bool}> $links
     */
    public function __construct(
        public array $items,
        public int $currentPage,
        public int $lastPage,
        public int $perPage,
        public ?int $from,
        public ?int $to,
        public int $total,
        public string $path,
        public array $links,
        public int $resultsUnreadCount,
        public int $resultsImportantCount,
    ) {
    }

    public function shouldClampPage(): bool
    {
        return $this->currentPage > $this->lastPage;
    }
}
