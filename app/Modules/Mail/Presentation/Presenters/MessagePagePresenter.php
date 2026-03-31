<?php

declare(strict_types=1);

namespace App\Modules\Mail\Presentation\Presenters;

use App\Modules\Mail\Application\UseCases\ListMessages\ListMessageItem;
use App\Modules\Mail\Application\UseCases\ListMessages\ListMessagesOutput;
use App\Modules\Mail\Presentation\ViewModels\Admin\MessageViewModel;
use App\Modules\Mail\Presentation\ViewModels\Admin\MessagesIndexViewModel;

final class MessagePagePresenter
{
    /**
     * @param array<string,mixed> $filters
     */
    public function buildIndexViewModel(
        ListMessagesOutput $messages,
        array $filters,
    ): MessagesIndexViewModel {
        return new MessagesIndexViewModel(
            messages: $this->presentPaginatedMessages($messages),
            stats: [
                'results_total' => $messages->total,
                'results_unread_count' => $messages->resultsUnreadCount,
                'results_important_count' => $messages->resultsImportantCount,
            ],
            filters: $filters,
        );
    }

    /**
     * @return array{
     *     data:array<int,array<string,mixed>>,
     *     current_page:int,
     *     last_page:int,
     *     per_page:int,
     *     from:?int,
     *     to:?int,
     *     total:int,
     *     path:string,
     *     links:array<int,array{url:string|null,label:string,active:bool}>
     * }
     */
    private function presentPaginatedMessages(ListMessagesOutput $messages): array
    {
        return [
            'data' => array_map(
                static fn(ListMessageItem $item): array => MessageViewModel::fromListItem($item)->toArray(),
                $messages->items,
            ),
            'current_page' => $messages->currentPage,
            'last_page' => $messages->lastPage,
            'per_page' => $messages->perPage,
            'from' => $messages->from,
            'to' => $messages->to,
            'total' => $messages->total,
            'path' => $messages->path,
            'links' => $messages->links,
        ];
    }
}
