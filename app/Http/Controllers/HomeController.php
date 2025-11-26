<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Experience;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\Technology;
use App\Services\CourseService;
use App\Services\ExperienceService;
use App\Services\ProjectService;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for the public homepage.
 */
class HomeController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
        private readonly ExperienceService $experienceService,
        private readonly CourseService $courseService,
    ) {}

    /**
     * Display homepage with published projects and experiences.
     */
    public function index(): Response
    {
        $projects = $this->fetchProjects();
        $experiences = $this->fetchExperiences();
        $courses = $this->fetchCourses();

        return Inertia::render('Home/Home', [
            /**
             * @var Collection<int,array<string,mixed>> $projects
             */
            'projects'    => $projects,
            /**
             * @var Collection<int,array<string,mixed>> $experiences
             */
            'experiences' => $experiences,
            /**
             * @var Collection<int,array<string,mixed>> $courses
             */
            'courses' => $courses,
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
                                    'src'   => $image->src,
                                    'alt' => $image->alt,
                                ];
                            }
                        ),
                        'technologies'     => $project->technologies->map(
                            /**
                             * @return array<string,mixed>
                             */
                            function (Technology $technology): array {
                                return [
                                    'id'   => $technology->id,
                                    'name' => $technology->name,
                                ];
                            }
                        ),
                        'display' => $project->display,
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
}
