<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HTTP controller for managing courses via Inertia.
 */
class CourseController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private readonly CourseService $courseService,
    ) {}

    /**
     * Display a paginated listing of courses.
     */
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 15);

        $courses = $this->courseService->paginate($perPage);

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'filters' => [
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new course.
     */
    public function create(): Response
    {
        return Inertia::render('Courses/Create');
    }

    /**
     * Store a newly created course.
     */
    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = $this->courseService->create($request->validated());

        return redirect()
            ->route('courses.edit', $course)
            ->with('status', 'Course successfully created.');
    }

    /**
     * Display the specified course.
     */
    public function show(Course $course): Response
    {
        return Inertia::render('Courses/Show', [
            'course' => $course,
        ]);
    }

    /**
     * Show the form for editing the specified course.
     */
    public function edit(Course $course): Response
    {
        return Inertia::render('Courses/Edit', [
            'course' => $course,
        ]);
    }

    /**
     * Update the specified course.
     */
    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $this->courseService->update($course, $request->validated());

        return redirect()
            ->route('courses.edit', $course)
            ->with('status', 'Course successfully updated.');
    }

    /**
     * Remove the specified course.
     */
    public function destroy(Course $course): RedirectResponse
    {
        $this->courseService->delete($course);

        return redirect()
            ->route('courses.index')
            ->with('status', 'Course successfully deleted.');
    }
}
