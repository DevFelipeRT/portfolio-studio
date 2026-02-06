<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\Capabilities\Providers;

use App\Modules\Courses\Application\Capabilities\Dtos\VisibleCourseItem;
use App\Modules\Courses\Application\Services\CourseTranslationResolver;
use App\Modules\Courses\Application\UseCases\ListVisibleCourses\ListVisibleCourses;
use App\Modules\Courses\Domain\Models\Course;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public visible courses.
 */
final class VisibleCourses implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListVisibleCourses $listVisibleCourses,
        private readonly CourseTranslationResolver $translationResolver,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'courses.visible.v1',
            'Returns public visible courses ordered by most recent start date.',
            [
                'locale' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => null,
                ],
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<VisibleCourseItem>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     */
    public function execute(array $parameters, ?ICapabilityContext $context = null): array
    {
        $limit = $this->extractLimit($parameters);
        $locale = $this->resolveLocale($parameters);
        $fallbackLocale = app()->getFallbackLocale();

        $courses = $this->listVisibleCourses->handle($locale, $fallbackLocale);

        if ($limit !== null) {
            $courses = $courses->take($limit);
        }

        return $this->mapCourses($courses, $locale, $fallbackLocale);
    }

    /**
     * @param array<string, mixed> $parameters
     */
    private function extractLimit(array $parameters): ?int
    {
        if (!array_key_exists('limit', $parameters)) {
            return null;
        }

        $rawLimit = $parameters['limit'];

        if ($rawLimit === null) {
            return null;
        }

        if (is_int($rawLimit)) {
            return $rawLimit > 0 ? $rawLimit : null;
        }

        if (is_numeric($rawLimit)) {
            $value = (int) $rawLimit;

            return $value > 0 ? $value : null;
        }

        return null;
    }

    /**
     * @param array<string, mixed> $parameters
     */
    private function resolveLocale(array $parameters): string
    {
        $locale = $parameters['locale'] ?? null;

        if (\is_string($locale)) {
            $trimmed = trim($locale);
            if ($trimmed !== '') {
                return $trimmed;
            }
        }

        return app()->getLocale();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function mapCourses(
        Collection $courses,
        string $locale,
        ?string $fallbackLocale,
    ): array
    {
        return $courses
            ->map(
                function (Course $course) use ($locale, $fallbackLocale): array {
                    $name = $this->translationResolver->resolveName(
                        $course,
                        $locale,
                        $fallbackLocale,
                    );
                    $institution = $this->translationResolver->resolveInstitution(
                        $course,
                        $locale,
                        $fallbackLocale,
                    );
                    $summary = $this->translationResolver->resolveSummary(
                        $course,
                        $locale,
                        $fallbackLocale,
                    );
                    $description = $this->translationResolver->resolveDescription(
                        $course,
                        $locale,
                        $fallbackLocale,
                    );

                    return VisibleCourseItem::fromModelWithTranslations(
                        $course,
                        $name,
                        $institution,
                        $summary,
                        $description,
                    )->toArray();
                }
            )
            ->values()
            ->all();
    }
}
