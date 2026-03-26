<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\ListExperiences;

use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListExperiences
{
    public function __construct(private readonly IExperienceRepository $experiences)
    {
    }

    public function handle(
        int $perPage = 15,
        ?string $search = null,
        ?string $visibility = null,
        ?string $sort = null,
        ?string $direction = null,
    ): LengthAwarePaginator
    {
        return $this->experiences->paginate(
            $perPage,
            $search,
            $visibility,
            $sort,
            $direction,
        );
    }
}
