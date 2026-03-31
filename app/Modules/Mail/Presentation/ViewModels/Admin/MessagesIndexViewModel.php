<?php

declare(strict_types=1);

namespace App\Modules\Mail\Presentation\ViewModels\Admin;

final readonly class MessagesIndexViewModel
{
    /**
     * @param array{
     *     data:array<int,array<string,mixed>>,
     *     current_page:int,
     *     last_page:int,
     *     per_page:int,
     *     from:?int,
     *     to:?int,
     *     total:int,
     *     path:string,
     *     links:array<int,array{url:string|null,label:string,active:bool}>
     * } $messages
     * @param array{results_total:int,results_unread_count:int,results_important_count:int} $stats
     * @param array<string,mixed> $filters
     */
    public function __construct(
        public array $messages,
        public array $stats,
        public array $filters,
    ) {
    }

    /**
     * @return array{
     *     messages:array<string,mixed>,
     *     stats:array{results_total:int,results_unread_count:int,results_important_count:int},
     *     filters:array<string,mixed>
     * }
     */
    public function toProps(): array
    {
        return [
            'messages' => $this->messages,
            'stats' => $this->stats,
            'filters' => $this->filters,
        ];
    }
}
