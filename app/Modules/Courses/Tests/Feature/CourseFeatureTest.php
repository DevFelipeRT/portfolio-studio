<?php

declare(strict_types=1);

namespace App\Modules\Courses\Tests\Feature;

use App\Modules\Courses\Application\UseCases\CreateCourse\CreateCourse;
use App\Modules\Courses\Domain\Enums\CourseCategories;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

final class CourseFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_course(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('courses.store'), [
            'locale' => 'en',
            'name' => 'Laravel Architecture',
            'institution' => 'OpenAI Academy',
            'category' => CourseCategories::CERTIFICATION->value,
            'summary' => 'Resumo do curso',
            'description' => 'Descricao detalhada do curso',
            'started_at' => '2025-01-01',
            'completed_at' => '2025-06-01',
            'display' => true,
        ]);

        $course = Course::query()->first();

        $response
            ->assertRedirect(route('courses.edit', $course))
            ->assertSessionHasNoErrors();

        $this->assertNotNull($course);
        $this->assertSame('Laravel Architecture', $course?->name);
    }

    public function test_it_validates_course_dates(): void
    {
        $this->actingAsAdmin();

        $response = $this->from(route('courses.create'))->post(route('courses.store'), [
            'locale' => 'en',
            'name' => 'Laravel Architecture',
            'institution' => 'OpenAI Academy',
            'category' => CourseCategories::CERTIFICATION->value,
            'summary' => 'Resumo do curso',
            'description' => 'Descricao detalhada do curso',
            'started_at' => '2025-06-01',
            'completed_at' => '2025-01-01',
        ]);

        $response
            ->assertRedirect(route('courses.create'))
            ->assertSessionHasErrors(['completed_at']);
    }

    public function test_it_creates_a_course_translation(): void
    {
        $this->actingAsAdmin();
        $course = $this->createCourse();

        $response = $this->postJson(route('courses.translations.store', $course), [
            'locale' => 'en',
            'name' => 'Laravel Architecture',
            'institution' => 'OpenAI Academy',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.name', 'Laravel Architecture');

        $this->assertDatabaseHas('course_translations', [
            'course_id' => $course->id,
            'locale' => 'en',
            'name' => 'Laravel Architecture',
        ]);
    }

    public function test_it_returns_not_found_when_updating_a_missing_course_translation(): void
    {
        $this->actingAsAdmin();
        $course = $this->createCourse();

        $response = $this->putJson(route('courses.translations.update', [$course, 'en']), [
            'name' => 'Updated name',
        ]);

        $response->assertNotFound();
    }

    public function test_it_does_not_mask_unexpected_course_creation_failures(): void
    {
        $this->actingAsAdmin();
        $this->withoutExceptionHandling();

        $this->app->bind(ICourseRepository::class, static fn (): ICourseRepository => new class implements ICourseRepository {
            public function paginateAdminList(
                int $perPage,
                ?string $search,
                ?string $institution,
                ?\App\Modules\Courses\Domain\ValueObjects\CourseStatus $status,
                ?string $visibility,
                ?string $sort,
                ?string $direction,
                ?string $locale,
                ?string $fallbackLocale = null,
            ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
                throw new RuntimeException('Unexpected method call.');
            }

            public function visibleWithTranslations(
                ?string $locale,
                ?string $fallbackLocale = null,
            ): \Illuminate\Database\Eloquent\Collection {
                throw new RuntimeException('Unexpected method call.');
            }

            public function findById(int $id): Course
            {
                throw new RuntimeException('Unexpected method call.');
            }

            public function create(array $attributes): Course
            {
                throw new RuntimeException('boom');
            }

            public function update(Course $course, array $attributes): Course
            {
                throw new RuntimeException('Unexpected method call.');
            }

            public function delete(Course $course): void
            {
                throw new RuntimeException('Unexpected method call.');
            }
        });

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('boom');

        $this->post(route('courses.store'), [
            'locale' => 'en',
            'name' => 'Laravel Architecture',
            'institution' => 'OpenAI Academy',
            'category' => CourseCategories::CERTIFICATION->value,
            'summary' => 'Resumo do curso',
            'description' => 'Descricao detalhada do curso',
            'started_at' => '2025-01-01',
            'completed_at' => '2025-06-01',
            'display' => true,
        ]);
    }

    private function createCourse(array $overrides = []): Course
    {
        return Course::query()->create(array_merge([
            'locale' => 'pt_BR',
            'name' => 'Curso Base',
            'institution' => 'Instituicao Base',
            'category' => CourseCategories::CERTIFICATION->value,
            'summary' => 'Resumo base',
            'description' => 'Descricao base',
            'started_at' => '2025-01-01',
            'completed_at' => '2025-06-01',
            'display' => true,
        ], $overrides));
    }
}
