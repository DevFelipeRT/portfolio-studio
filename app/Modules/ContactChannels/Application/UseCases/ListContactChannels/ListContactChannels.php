<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ListContactChannels;

use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListContactChannels
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
    ) {
    }

    public function handle(
        int $perPage = 15,
        ?string $search = null,
        ?string $type = null,
        ?bool $isActive = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator
    {
        return $this->repository->paginateOrdered(
            $perPage,
            $search,
            $type,
            $isActive,
            $sort,
            $direction,
        );
    }
}
