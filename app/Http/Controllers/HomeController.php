<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Mappers\CourseMapper;
use App\Mappers\ExperienceMapper;
use App\Mappers\InitiativeMapper;
use App\Mappers\ProjectMapper;
use App\Mappers\TechnologyMapper;
use App\Services\CourseService;
use App\Services\ExperienceService;
use App\Services\InitiativeService;
use App\Services\ProjectService;
use App\Services\TechnologyService;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\VarDumper\VarDumper;

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
