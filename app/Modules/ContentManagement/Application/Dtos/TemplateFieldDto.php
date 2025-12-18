<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Dtos;

/**
 * Data transfer object describing a template field schema.
 */
final class TemplateFieldDto
{
    /**
     * @param array<int,string>          $validationRules
     * @param array<int,TemplateFieldDto> $itemFields
     */
    public function __construct(
        public readonly string $name,
        public readonly string $label,
        public readonly string $type,
        public readonly bool $required,
        public readonly mixed $defaultValue,
        public readonly array $validationRules,
        public readonly array $itemFields = [],
    ) {
    }
}
