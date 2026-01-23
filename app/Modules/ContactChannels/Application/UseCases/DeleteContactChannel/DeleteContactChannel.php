<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\DeleteContactChannel;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;

final class DeleteContactChannel
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
    ) {
    }

    public function handle(ContactChannel $channel): void
    {
        $this->repository->delete($channel);
    }
}
