<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\TechnologyCategories;
use App\Models\Course;
use App\Models\Experience;
use App\Models\Initiative;
use App\Models\InitiativeImage;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\Technology;
use App\Services\CourseService;
use App\Services\ExperienceService;
use App\Services\InitiativeService;
use App\Services\ProjectService;
use App\Services\TechnologyService;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\VarDumper\VarDumper;

/**
 * HTTP controller for the public homepage.
 */
class HomeController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
        private readonly ExperienceService $experienceService,
        private readonly CourseService $courseService,
        private readonly TechnologyService $techService,
        private readonly InitiativeService $initiativeService,
    ) {}

    /**
     * Display homepage with published projects and experiences.
     */
    public function index(): Response
    {
        $projects     = $this->fetchProjects();
        $experiences  = $this->fetchExperiences();
        $courses      = $this->fetchCourses();
        $technologies = $this->fetchTechnologies();
        $initiatives  = $this->fetchInitiatives();

        return Inertia::render('Home/Home', [
            'projects'    => $projects,
            'experiences' => $experiences,
            'courses'     => $courses,
            'technologies' => $technologies,
            'initiatives' => $initiatives,
        ]);
    }

    private function fetchProjects(): Collection
    {
        $projects = $this->projectService
            ->visible()
            ->map(
                /**
                 * @return array<string,mixed>
                 */
                function (Project $project): array {
                    return [
                        'id'                => $project->id,
                        'name'              => $project->name,
                        'short_description' => $project->short_description,
                        'long_description'  => $project->long_description,
                        'repository_url'    => $project->repository_url,
                        'live_url'          => $project->live_url,
                        'images'            => $project->images?->map(
                            /**
                             * @return array<string,mixed>
                             */
                            function (ProjectImage $image): array {
                                return [
                                    'src' => $image->src,
                                    'alt' => $image->alt,
                                ];
                            }
                        ),
                        'technologies'      => $project->technologies->map(
                            /**
                             * @return array<string,mixed>
                             */
                            function (Technology $technology): array {
                                return [
                                    'id'       => $technology->id,
                                    'name'     => $technology->name,
                                    'category' => $technology->category,
                                ];
                            }
                        ),
                        'display'           => $project->display,
                    ];
                }
            );

        return $projects;
    }

    private function fetchExperiences(): Collection
    {
        $experiences = $this->experienceService
            ->visible()
            ->map(
                /**
                 * @return array<string,mixed>
                 */
                function (Experience $experience): array {
                    return [
                        'id'                => $experience->id,
                        'position'          => $experience->position,
                        'company'           => $experience->company,
                        'short_description' => $experience->short_description,
                        'long_description'  => $experience->long_description,
                        'start_date'        => $experience->start_date,
                        'end_date'          => $experience->end_date,
                        'display'           => $experience->display,
                    ];
                }
            );

        return $experiences;
    }

    private function fetchCourses(): Collection
    {
        $courses = $this->courseService
            ->visible()
            ->map(
                /**
                 * @return array<string,mixed>
                 */
                function (Course $course): array {
                    return [
                        'id'                => $course->id,
                        'name'              => $course->name,
                        'institution'       => $course->institution,
                        'short_description' => $course->short_description,
                        'long_description'  => $course->long_description,
                        'start_date'        => $course->start_date,
                        'end_date'          => $course->end_date,
                        'display'           => $course->display,
                    ];
                }
            );

        return $courses;
    }

    /**
     * Fetch technologies grouped by category for UI consumption.
     *
     * @return Collection<int, array{
     *     id: string,
     *     title: string,
     *     technologies: array<int, array{id:int,name:string}>
     * }>
     */
    private function fetchTechnologies(): Collection
    {
        return $this->techService
            ->groupedByCategory()
            ->map(
                /**
                 * @param EloquentCollection<int,Technology> $group
                 */
                function (EloquentCollection $group, string $category): array {
                    $enum = TechnologyCategories::from($category);

                    return [
                        'id'           => $enum->value,
                        'title'        => $enum->label(),
                        'technologies' => $group
                            ->sortBy('name')
                            ->values()
                            ->map(
                                fn(Technology $tech): array => [
                                    'id'   => $tech->id,
                                    'name' => $tech->name,
                                ],
                            )
                            ->all(),
                    ];
                },
            )
            ->values();
    }

    // App\Http\Controllers\HomeController.php

    /**
     * Fetch visible initiatives for the landing page.
     */
    private function fetchInitiatives(): Collection
    {
        return $this->initiativeService
            ->visible()
            ->map(
                /**
                 * @return array<string,mixed>
                 */
                function (Initiative $initiative): array {
                    return [
                        'id'                => $initiative->id,
                        'name'              => $initiative->name,
                        'short_description' => $initiative->short_description,
                        'long_description'  => $initiative->long_description,
                        'start_date'        => $initiative->start_date,
                        'end_date'          => $initiative->end_date,
                        'display'           => $initiative->display,
                        'images'            => $initiative->images?->map(
                            /**
                             * @return array<string,mixed>
                             */
                            function (InitiativeImage $image): array {
                                return [
                                    'src' => $image->src,
                                    'alt' => $image->alt,
                                ];
                            }
                        ),
                    ];
                }
            );
    }
}
