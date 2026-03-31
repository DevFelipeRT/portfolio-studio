<?php

declare(strict_types=1);

namespace App\Modules\Mail\Infrastructure\Repositories;

use App\Modules\Mail\Domain\Models\Message;
use App\Modules\Mail\Domain\Repositories\IMessageRepository;
use App\Modules\Mail\Infrastructure\Queries\MessageAdminListQuery;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class MessageRepository implements IMessageRepository
{
    public function __construct(
        private readonly MessageAdminListQuery $messageAdminListQuery,
    ) {
    }

    public function paginateAdminInbox(
        int $perPage,
        int $page = 1,
        ?string $search = null,
        ?string $seenFilter = null,
        ?string $importantFilter = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator {
        return $this->messageAdminListQuery->paginate(
            perPage: $perPage,
            page: $page,
            search: $search,
            seenFilter: $seenFilter,
            importantFilter: $importantFilter,
            sort: $sort,
            direction: $direction,
        );
    }

    public function countAdminInboxStats(
        ?string $search = null,
        ?string $seenFilter = null,
        ?string $importantFilter = null,
    ): array {
        return $this->messageAdminListQuery->stats(
            search: $search,
            seenFilter: $seenFilter,
            importantFilter: $importantFilter,
        );
    }

    public function findById(int $id): Message
    {
        return Message::query()->findOrFail($id);
    }

    public function create(array $attributes): Message
    {
        return Message::query()->create($attributes);
    }

    public function update(Message $message, array $attributes): Message
    {
        $message->update($attributes);

        return $message;
    }

    public function delete(Message $message): void
    {
        $message->delete();
    }
}
