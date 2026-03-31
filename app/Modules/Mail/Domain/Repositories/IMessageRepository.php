<?php

declare(strict_types=1);

namespace App\Modules\Mail\Domain\Repositories;

use App\Modules\Mail\Domain\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IMessageRepository
{
    public function paginateAdminInbox(
        int $perPage,
        int $page = 1,
        ?string $search = null,
        ?string $seenFilter = null,
        ?string $importantFilter = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator;

    /**
     * @return array{results_unread_count:int,results_important_count:int}
     */
    public function countAdminInboxStats(
        ?string $search = null,
        ?string $seenFilter = null,
        ?string $importantFilter = null,
    ): array;

    public function findById(int $id): Message;

    /**
     * @param array<string,mixed> $attributes
     */
    public function create(array $attributes): Message;

    /**
     * @param array<string,mixed> $attributes
     */
    public function update(Message $message, array $attributes): Message;

    public function delete(Message $message): void;
}
