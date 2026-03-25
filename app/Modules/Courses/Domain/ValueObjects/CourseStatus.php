<?php

declare(strict_types=1);

namespace App\Modules\Courses\Domain\ValueObjects;

use App\Modules\Courses\Domain\Enums\CourseStatusValue;
use Carbon\CarbonImmutable;
use InvalidArgumentException;

final readonly class CourseStatus
{
    private function __construct(
        private CourseStatusValue $value,
    ) {
    }

    public static function fromValue(CourseStatusValue $value): self
    {
        return new self($value);
    }

    public static function fromDates(
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt,
        ?CarbonImmutable $referenceDay = null,
    ): self {
        $resolvedReferenceDay = ($referenceDay ?? CarbonImmutable::now())->startOfDay();

        self::assertValidPeriod($startedAt, $completedAt);

        foreach (self::resolutionOrder() as $status) {
            if ($status->matchesDates($startedAt, $completedAt, $resolvedReferenceDay)) {
                return $status;
            }
        }

        throw new InvalidArgumentException('Could not resolve course status.');
    }

    /**
     * @return array<int,self>
     */
    public static function resolutionOrder(): array
    {
        return [
            self::fromValue(CourseStatusValue::PLANNED),
            self::fromValue(CourseStatusValue::COMPLETED),
            self::fromValue(CourseStatusValue::IN_PROGRESS),
        ];
    }

    /**
     * @return array<int,self>
     */
    public static function sortOrder(): array
    {
        return [
            self::fromValue(CourseStatusValue::PLANNED),
            self::fromValue(CourseStatusValue::IN_PROGRESS),
            self::fromValue(CourseStatusValue::COMPLETED),
        ];
    }

    public function value(): CourseStatusValue
    {
        return $this->value;
    }

    public function is(CourseStatusValue $value): bool
    {
        return $this->value === $value;
    }

    public function toScalar(): string
    {
        return $this->value->value;
    }

    public function matchesDates(
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt,
        CarbonImmutable $referenceDay,
    ): bool {
        return match ($this->value) {
            CourseStatusValue::PLANNED => self::matchesPlanned(
                $startedAt,
                $completedAt,
                $referenceDay,
            ),
            CourseStatusValue::COMPLETED => self::matchesCompleted(
                $startedAt,
                $completedAt,
                $referenceDay,
            ),
            CourseStatusValue::IN_PROGRESS => self::matchesInProgress(
                $startedAt,
                $completedAt,
                $referenceDay,
            ),
        };
    }

    public function __toString(): string
    {
        return $this->toScalar();
    }

    private static function assertValidPeriod(
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt,
    ): void {
        if ($startedAt !== null && $completedAt !== null && $startedAt->greaterThan($completedAt)) {
            throw new InvalidArgumentException('Invalid period of time.');
        }
    }

    private static function matchesPlanned(
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt,
        CarbonImmutable $referenceDay,
    ): bool {
        $completedIsUpcomingOrMissing = $completedAt === null
            || $completedAt->greaterThanOrEqualTo($referenceDay);

        $startedIsFutureOrMissing = $startedAt === null
            || $startedAt->greaterThan($referenceDay);

        return $completedIsUpcomingOrMissing && $startedIsFutureOrMissing;
    }

    private static function matchesCompleted(
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt,
        CarbonImmutable $referenceDay,
    ): bool {
        $completedIsPast = $completedAt !== null
            && $completedAt->lessThan($referenceDay);

        $startedIsCurrentOrPastOrMissing = $startedAt === null
            || $startedAt->lessThanOrEqualTo($referenceDay);

        return $completedIsPast && $startedIsCurrentOrPastOrMissing;
    }

    private static function matchesInProgress(
        ?CarbonImmutable $startedAt,
        ?CarbonImmutable $completedAt,
        CarbonImmutable $referenceDay,
    ): bool {
        $completedIsUpcomingOrMissing = $completedAt === null
            || $completedAt->greaterThanOrEqualTo($referenceDay);

        $startedIsCurrentOrPastOrMissing = $startedAt === null
            || $startedAt->lessThanOrEqualTo($referenceDay);

        return $completedIsUpcomingOrMissing && $startedIsCurrentOrPastOrMissing;
    }
}
