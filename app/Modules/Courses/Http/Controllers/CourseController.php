<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Courses\Domain\Enums\CourseCategories;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Application\UseCases\CreateCourse\CreateCourse;
use App\Modules\Courses\Application\UseCases\DeleteCourse\DeleteCourse;
use App\Modules\Courses\Application\UseCases\ListCourses\ListCourses;
use App\Modules\Courses\Application\UseCases\UpdateCourse\UpdateCourse;
use App\Modules\Courses\Http\Requests\Course\StoreCourseRequest;
use App\Modules\Courses\Http\Requests\Course\UpdateCourseRequest;
use App\Modules\Courses\Http\Mappers\CourseInputMapper;
use App\Modules\Courses\Presentation\Mappers\CourseMapper;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

use Inertia\Inertia;
use Inertia\Response;
use Throwable;

/**
 * HTTP controller for managing courses via Inertia.
 * Handles CRUD operations with robust error handling and logging.
 */
class CourseController extends Controller
{
    public function __construct(
        private readonly ListCourses $listCourses,
        private readonly CreateCourse $createCourse,
        private readonly UpdateCourse $updateCourse,
        private readonly DeleteCourse $deleteCourse,
    ) {
    }

    /**
     * Display a paginated listing of courses.
     */
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query(key: 'per_page', default: '15');

        $paginatedCourses = $this->listCourses->handle($perPage);

        $mapped = $this->mapPaginatedResource($paginatedCourses, CourseMapper::class);

        return Inertia::render('Courses/Pages/Index', [
            'courses' => $mapped,
            'filters' => ['per_page' => $perPage],
        ]);
    }

    /**
     * Show the form for creating a new course.
     */
    public function create(): Response
    {
        return Inertia::render('Courses/Pages/Create', [
            'course_categories' => CourseCategories::options(),
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(StoreCourseRequest $request): RedirectResponse
    {
        try {
            $input = CourseInputMapper::fromStoreRequest($request);
            $course = $this->createCourse->handle($input);

            // 303 See Other is recommended for Inertia POST requests to ensure a GET follow-up
            return redirect()
                ->route('courses.edit', $course, 303)
                ->with('success', 'Course created successfully.');
        } catch (ValidationException | AuthorizationException $e) {
            // Let Laravel handle validation and authorization errors natively
            throw $e;
        } catch (Throwable $e) {
            Log::error('Failed to create course', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->validated(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'An error occurred while creating the course. Please try again.');
        }
    }

    /**
     * Display the specified course.
     */
    public function show(Course $course): Response
    {
        return Inertia::render('Courses/Show', [
            'course' => CourseMapper::toArray($course),
        ]);
    }

    /**
     * Show the form for editing the specified course.
     */
    public function edit(Course $course): Response
    {
        return Inertia::render('Courses/Pages/Edit', [
            'course' => CourseMapper::toArray($course),
            'course_categories' => CourseCategories::options(),
        ]);
    }

    /**
     * Update the specified course.
     */
    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        try {
            $input = CourseInputMapper::fromUpdateRequest($request, $course);
            $this->updateCourse->handle($course, $input);

            // 303 See Other is strictly recommended for Inertia PUT/PATCH requests
            return redirect()
                ->route('courses.edit', $course, 303)
                ->with('success', 'Course updated successfully.');
        } catch (ValidationException | AuthorizationException | ModelNotFoundException $e) {
            // Let Laravel handle validation, authorization, and 404s natively
            throw $e;
        } catch (Throwable $e) {
            Log::error("Failed to update course ID {$course->id}", [
                'error' => $e->getMessage(),
                'payload' => $request->validated(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Unable to update the course details. Please try again later.');
        }
    }

    /**
     * Remove the specified course.
     */
    public function destroy(Course $course): RedirectResponse
    {
        try {
            $this->deleteCourse->handle($course);

            // 303 See Other is strictly recommended for Inertia DELETE requests
            return redirect()
                ->route('courses.index', [], 303)
                ->with('success', 'Course deleted successfully.');
        } catch (ValidationException | AuthorizationException | ModelNotFoundException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error("Failed to delete course ID {$course->id}", [
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'An error occurred while trying to delete the course.');
        }
    }
}
