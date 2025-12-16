<?php

declare(strict_types=1);

namespace App\Modules\Home;

use App\Modules\Shared\Abstractions\Http\Controller;

use App\Modules\Initiatives\Application\Services\InitiativeService;
use App\Modules\Initiatives\Presentation\Mappers\InitiativeMapper;
use App\Modules\Projects\Application\Services\ProjectService;
use App\Modules\Projects\Presentation\Mappers\ProjectMapper;

use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\VarDumper\VarDumper;

final class HomeController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
        private readonly InitiativeService $initiativeService,
        private readonly HomeService $homeService,
    ) {
    }

    /**
     * Display homepage with published projects, experiences, courses, technologies, and initiatives.
     */
    public function index(): Response
    {
        $resources = [
            'projects' => [$this->projectService, ProjectMapper::class],
            'initiatives' => [$this->initiativeService, InitiativeMapper::class],
        ];

        $data = $this->mapResources($resources, 'visible');

        $data['experiences'] = $this->homeService->loadVisibleExperiences();
        $data['courses'] = $this->homeService->loadVisibleCourses();
        $data['technologies'] = $this->homeService->loadTechnologiesByCategory();

        VarDumper::dump($data);

        return Inertia::render('Home/Home', $data);
    }
}
