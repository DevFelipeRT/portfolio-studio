<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\ListMessages;

use App\Modules\Mail\Application\Mappers\MessageAdminOutputMapper;
use App\Modules\Mail\Domain\Models\Message;
use App\Modules\Mail\Domain\Repositories\IMessageRepository;

final class ListMessages
{
    public function __construct(
        private readonly IMessageRepository $repository,
        private readonly MessageAdminOutputMapper $messageAdminOutputMapper,
    ) {
    }

    public function handle(ListMessagesInput $input): ListMessagesOutput
    {
        $messages = $this->repository->paginateAdminInbox(
            perPage: $input->perPage,
            page: $input->page,
            search: $input->search,
            seenFilter: $input->seen,
            importantFilter: $input->important,
            sort: $input->sort,
            direction: $input->direction,
        );

        $stats = $this->repository->countAdminInboxStats(
            search: $input->search,
            seenFilter: $input->seen,
            importantFilter: $input->important,
        );

        return new ListMessagesOutput(
            items: array_map(
                fn(Message $message): ListMessageItem => $this->messageAdminOutputMapper->toListMessageItem($message),
                $messages->items(),
            ),
            currentPage: $messages->currentPage(),
            lastPage: $messages->lastPage(),
            perPage: $messages->perPage(),
            from: $messages->firstItem(),
            to: $messages->lastItem(),
            total: $messages->total(),
            path: $messages->path(),
            links: $messages->linkCollection()
                ->map(static fn(array $link): array => [
                    'url' => $link['url'],
                    'label' => (string) $link['label'],
                    'active' => (bool) $link['active'],
                ])
                ->values()
                ->all(),
            resultsUnreadCount: $stats['results_unread_count'],
            resultsImportantCount: $stats['results_important_count'],
        );
    }
}
