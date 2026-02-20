<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\UseCases\UpdateCourseTranslation;

use App\Modules\Courses\Application\Dtos\CourseTranslationDto;
use App\Modules\Courses\Application\Services\SupportedLocalesResolver;
use App\Modules\Courses\Domain\Repositories\ICourseRepository;
use App\Modules\Courses\Domain\Repositories\ICourseTranslationRepository;
use App\Modules\Shared\Contracts\RichText\IRichTextService;
use InvalidArgumentException;

final class UpdateCourseTranslation
{
    public function __construct(
        private readonly ICourseRepository $courses,
        private readonly ICourseTranslationRepository $translations,
        private readonly SupportedLocalesResolver $supportedLocales,
        private readonly IRichTextService $richText,
    ) {
    }

    public function handle(UpdateCourseTranslationInput $input): CourseTranslationDto
    {
        $supported = $this->supportedLocales->resolve();
        if (!in_array($input->locale, $supported, true)) {
            throw new InvalidArgumentException('Unsupported locale for course translation.');
        }

        $course = $this->courses->findById($input->courseId);

        if ($input->locale === $course->locale) {
            throw new InvalidArgumentException('Course translation locale must differ from base locale.');
        }

        $existing = $this->translations->findByCourseAndLocale($course, $input->locale);
        if ($existing === null) {
            throw new InvalidArgumentException('Course translation not found for this locale.');
        }

        $payload = $this->normalizePayload($input);
        if ($this->isPayloadEmpty($payload)) {
            throw new InvalidArgumentException('Course translation requires at least one translated field.');
        }

        $updated = $this->translations->update($existing, $payload);

        return CourseTranslationDto::fromModel($updated);
    }

    /**
     * @return array{name?:string|null,institution?:string|null,summary?:string|null,description?:string|null}
     */
    private function normalizePayload(UpdateCourseTranslationInput $input): array
    {
        $descriptionRaw = $this->normalizeText($input->description);
        if ($descriptionRaw !== null) {
            $preparedDescription = $this->richText->prepareForPersistence($descriptionRaw, 'description');
            $descriptionRaw = $preparedDescription->normalized();
        }

        return [
            'name' => $this->normalizeText($input->name),
            'institution' => $this->normalizeText($input->institution),
            'summary' => $this->normalizeText($input->summary),
            'description' => $descriptionRaw,
        ];
    }

    private function normalizeText(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    /**
     * @param array{name?:string|null,institution?:string|null,summary?:string|null,description?:string|null} $payload
     */
    private function isPayloadEmpty(array $payload): bool
    {
        foreach ($payload as $value) {
            if ($value !== null) {
                return false;
            }
        }

        return true;
    }
}
