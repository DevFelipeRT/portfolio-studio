<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Mappers;

use App\Modules\ContentManagement\Application\Dtos\TemplateDefinitionDto;
use App\Modules\ContentManagement\Application\Dtos\TemplateFieldDto;
use App\Modules\ContentManagement\Domain\Templates\TemplateDefinition;
use App\Modules\ContentManagement\Domain\Templates\TemplateField;

/**
 * Maps template domain definitions to DTOs and array payloads.
 */
final class TemplateDefinitionMapper
{
    /**
     * Builds a TemplateDefinitionDto from a TemplateDefinition.
     */
    public static function toDto(TemplateDefinition $definition): TemplateDefinitionDto
    {
        $allowedSlots = [];

        foreach ($definition->allowedSlots() as $slot) {
            $allowedSlots[] = $slot->value();
        }

        $fieldDtos = [];

        foreach ($definition->fields() as $field) {
            $fieldDtos[] = self::mapFieldToDto($field);
        }

        return new TemplateDefinitionDto(
            key: $definition->key()->value(),
            label: $definition->label(),
            description: $definition->description(),
            allowedSlots: $allowedSlots,
            fields: $fieldDtos,
        );
    }

    /**
     * Builds an array payload suitable for frontend consumption from a TemplateDefinition.
     *
     * @return array<string,mixed>
     */
    public static function toArray(TemplateDefinition $definition): array
    {
        $dto = self::toDto($definition);

        return [
            'key' => $dto->key,
            'label' => $dto->label,
            'description' => $dto->description,
            'allowed_slots' => $dto->allowedSlots,
            'fields' => array_map(
                static fn(TemplateFieldDto $field): array => [
                    'name' => $field->name,
                    'label' => $field->label,
                    'type' => $field->type,
                    'required' => $field->required,
                    'default' => $field->defaultValue,
                    'rules' => $field->validationRules,
                ],
                $dto->fields,
            ),
        ];
    }

    /**
     * Builds a TemplateFieldDto from a TemplateField.
     */
    private static function mapFieldToDto(TemplateField $field): TemplateFieldDto
    {
        return new TemplateFieldDto(
            name: $field->name(),
            label: $field->label(),
            type: $field->type(),
            required: $field->isRequired(),
            defaultValue: $field->defaultValue(),
            validationRules: $field->validationRules(),
        );
    }
}
