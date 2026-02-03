<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Courses\Application\UseCases\CreateCourseTranslation\CreateCourseTranslation;
use App\Modules\Courses\Application\UseCases\CreateCourseTranslation\CreateCourseTranslationInput;
use App\Modules\Courses\Application\UseCases\DeleteCourseTranslation\DeleteCourseTranslation;
use App\Modules\Courses\Application\UseCases\ListCourseTranslations\ListCourseTranslations;
use App\Modules\Courses\Application\UseCases\UpdateCourseTranslation\UpdateCourseTranslation;
use App\Modules\Courses\Application\UseCases\UpdateCourseTranslation\UpdateCourseTranslationInput;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Http\Requests\CourseTranslation\StoreCourseTranslationRequest;
use App\Modules\Courses\Http\Requests\CourseTranslation\UpdateCourseTranslationRequest;
use Illuminate\Http\JsonResponse;

final class CourseTranslationController extends Controller
{
    public function __construct(
        private readonly ListCourseTranslations $listCourseTranslations,
        private readonly CreateCourseTranslation $createCourseTranslation,
        private readonly UpdateCourseTranslation $updateCourseTranslation,
        private readonly DeleteCourseTranslation $deleteCourseTranslation,
    ) {
    }

    public function index(Course $course): JsonResponse
    {
        $items = $this->listCourseTranslations->handle($course);

        return response()->json([
            'data' => array_map(static fn($dto): array => $dto->toArray(), $items),
        ]);
    }

    public function store(
        StoreCourseTranslationRequest $request,
        Course $course,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->createCourseTranslation->handle(
            new CreateCourseTranslationInput(
                courseId: $course->id,
                locale: $data['locale'],
                name: $data['name'] ?? null,
                institution: $data['institution'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ], 201);
    }

    public function update(
        UpdateCourseTranslationRequest $request,
        Course $course,
        string $locale,
    ): JsonResponse {
        $data = $request->validated();

        $dto = $this->updateCourseTranslation->handle(
            new UpdateCourseTranslationInput(
                courseId: $course->id,
                locale: $data['locale'],
                name: $data['name'] ?? null,
                institution: $data['institution'] ?? null,
                summary: $data['summary'] ?? null,
                description: $data['description'] ?? null,
            ),
        );

        return response()->json([
            'data' => $dto->toArray(),
        ]);
    }

    public function destroy(Course $course, string $locale): JsonResponse
    {
        $this->deleteCourseTranslation->handle($course->id, $locale);

        return response()->json(null, 204);
    }
}
