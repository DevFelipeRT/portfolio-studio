<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Dtos;

/**
 * Data transfer object describing a template definition.
 */
final class TemplateDefinitionDto
{
    /**
     * @param array<int,string>          $allowedSlots
     * @param array<int,TemplateFieldDto> $fields
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly ?string $description,
        public readonly array $allowedSlots,
        public readonly array $fields,
    ) {
    }
}
