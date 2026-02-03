<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\UseCases\DeleteExperience;

use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Experiences\Domain\Repositories\IExperienceRepository;

final class DeleteExperience
{
    public function __construct(private readonly IExperienceRepository $experiences)
    {
    }

    public function handle(Experience $experience): void
    {
        $this->experiences->delete($experience);
    }
}
