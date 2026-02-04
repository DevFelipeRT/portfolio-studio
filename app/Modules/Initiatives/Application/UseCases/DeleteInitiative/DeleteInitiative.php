<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Application\UseCases\DeleteInitiative;

use App\Modules\Initiatives\Domain\Models\Initiative;
use App\Modules\Initiatives\Domain\Repositories\IInitiativeRepository;
use App\Modules\Initiatives\Application\Services\InitiativeImageService;
use App\Modules\Images\Domain\Models\Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

final class DeleteInitiative
{
    public function __construct(
        private readonly IInitiativeRepository $initiatives,
        private readonly InitiativeImageService $initiativeImageService,
    ) {
    }

    public function handle(Initiative $initiative): void
    {
        DB::transaction(function () use ($initiative): void {
            /** @var Collection<int,Image> $images */
            $images = $initiative->images()->get();

            foreach ($images as $image) {
                $this->initiativeImageService->detach($initiative, $image);
            }

            $this->initiatives->delete($initiative);
        });
    }
}
