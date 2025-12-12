<?php

declare(strict_types=1);

namespace App\Modules\Home;

use App\Modules\Shared\Abstractions\Base\Controller;

use App\Modules\Courses\Application\Services\CourseService;
use App\Modules\Courses\Presentation\Mappers\CourseMapper;
use App\Modules\Experiences\Application\Services\ExperienceService;
use App\Modules\Experiences\Presentation\Mappers\ExperienceMapper;
use App\Modules\Initiatives\Application\Services\InitiativeService;
use App\Modules\Initiatives\Presentation\Mappers\InitiativeMapper;
use App\Modules\Projects\Application\Services\ProjectService;
use App\Modules\Projects\Presentation\Mappers\ProjectMapper;
use App\Modules\Technologies\Application\Services\TechnologyService;
use App\Modules\Technologies\Presentation\Mappers\TechnologyMapper;

use Inertia\Inertia;
use Inertia\Response;

final class HomeController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
        private readonly ExperienceService $experienceService,
        private readonly CourseService $courseService,
        private readonly TechnologyService $techService,
        private readonly InitiativeService $initiativeService,
    ) {
    }

    /**
     * Display homepage with published projects, experiences, courses, technologies, and initiatives.
     */
    public function index(): Response
    {
        $resources = [
            'projects' => [$this->projectService, ProjectMapper::class],
            'experiences' => [$this->experienceService, ExperienceMapper::class],
            'courses' => [$this->courseService, CourseMapper::class],
            'initiatives' => [$this->initiativeService, InitiativeMapper::class],
        ];

        $data = $this->mapResources($resources, 'visible');

        // Transform technologies grouped by category
        $techGroups = $this->techService->groupedByCategory()->all();
        $data['technologies'] = TechnologyMapper::groupedByCategory($techGroups);

        return Inertia::render('Home/Home', $data);
    }
}
