<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\ValueObjects;

use App\Modules\Projects\Domain\Enums\ProjectStatusValue;
use InvalidArgumentException;

final readonly class ProjectStatus
{
    private function __construct(
        private ProjectStatusValue $value,
    ) {
    }

    public static function fromValue(ProjectStatusValue $value): self
    {
        return new self($value);
    }

    public static function fromScalar(string $value): self
    {
        $resolved = self::tryFromScalar($value);

        if ($resolved === null) {
            throw new InvalidArgumentException('Unsupported project status.');
        }

        return $resolved;
    }

    public static function tryFromScalar(?string $value): ?self
    {
        if ($value === null) {
            return null;
        }

        $normalized = self::normalizeScalar($value);

        if ($normalized === '') {
            return null;
        }

        $resolved = ProjectStatusValue::tryFrom($normalized);

        return $resolved !== null ? self::fromValue($resolved) : null;
    }

    /**
     * @return array<int,string>
     */
    public static function scalarValues(): array
    {
        return array_map(
            static fn(ProjectStatusValue $value): string => $value->value,
            ProjectStatusValue::cases(),
        );
    }

    /**
     * @return array<int,string>
     */
    public function equivalentScalars(): array
    {
        $canonical = $this->toScalar();
        $aliases = array_keys(self::legacyAliasMap(), $canonical, true);

        return array_values(array_unique([$canonical, ...$aliases]));
    }

    public function value(): ProjectStatusValue
    {
        return $this->value;
    }

    public function is(ProjectStatusValue $value): bool
    {
        return $this->value === $value;
    }

    public function toScalar(): string
    {
        return $this->value->value;
    }

    public function __toString(): string
    {
        return $this->toScalar();
    }

    private static function normalizeScalar(string $value): string
    {
        $trimmed = trim($value);

        if ($trimmed === '') {
            return '';
        }

        return self::legacyAliasMap()[$trimmed] ?? $trimmed;
    }

    /**
     * @return array<string,string>
     */
    private static function legacyAliasMap(): array
    {
        return [
            'em_andamento' => ProjectStatusValue::IN_PROGRESS->value,
            'concluido' => ProjectStatusValue::DELIVERED->value,
            'completed' => ProjectStatusValue::DELIVERED->value,
            'published' => ProjectStatusValue::DELIVERED->value,
            'manutencao' => ProjectStatusValue::MAINTENANCE->value,
            'planejado' => ProjectStatusValue::PLANNED->value,
        ];
    }
}
