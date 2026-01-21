<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Mappers;

use App\Modules\ContentManagement\Application\Dtos\TemplateDefinitionDto;
use App\Modules\ContentManagement\Application\Dtos\TemplateFieldDto;
use App\Modules\ContentManagement\Application\Services\Templates\TemplateTranslationService;
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
    public static function toDto(
        TemplateDefinition $definition,
        ?TemplateTranslationService $translationService = null,
        ?string $locale = null,
    ): TemplateDefinitionDto
    {
        $allowedSlots = [];

        foreach ($definition->allowedSlots() as $slot) {
            $allowedSlots[] = $slot->value();
        }

        $fieldDtos = [];

        foreach ($definition->fields() as $field) {
            $fieldDtos[] = self::mapFieldToDto(
                $definition,
                $field,
                $translationService,
                $locale,
            );
        }

        return new TemplateDefinitionDto(
            key: $definition->key()->value(),
            label: self::resolveTemplateLabel($definition, $translationService, $locale),
            description: self::resolveTemplateDescription($definition, $translationService, $locale),
            allowedSlots: $allowedSlots,
            fields: $fieldDtos,
            origin: $definition->origin(),
            templateName: $definition->templateName(),
        );
    }

    /**
     * Builds an array payload suitable for frontend consumption from a TemplateDefinition.
     *
     * @return array<string,mixed>
     */
    public static function toArray(
        TemplateDefinition $definition,
        ?TemplateTranslationService $translationService = null,
        ?string $locale = null,
    ): array
    {
        $dto = self::toDto($definition, $translationService, $locale);

        return [
            'key' => $dto->key,
            'label' => $dto->label,
            'description' => $dto->description,
            'allowed_slots' => $dto->allowedSlots,
            'fields' => array_map(
                static fn(TemplateFieldDto $field): array => self::mapFieldDtoToArray($field),
                $dto->fields,
            ),
            'origin' => $dto->origin,
            'template_name' => $dto->templateName,
        ];
    }

    /**
     * Builds a TemplateFieldDto from a TemplateField.
     */
    private static function mapFieldToDto(
        TemplateDefinition $definition,
        TemplateField $field,
        ?TemplateTranslationService $translationService,
        ?string $locale,
    ): TemplateFieldDto
    {
        $itemFieldDtos = [];

        if ($field->isCollection()) {
            foreach ($field->itemFields() as $itemField) {
                $itemFieldDtos[] = self::mapFieldToDto(
                    $definition,
                    $itemField,
                    $translationService,
                    $locale,
                );
            }
        }

        return new TemplateFieldDto(
            name: $field->name(),
            label: self::resolveFieldLabel($definition, $field, $translationService, $locale),
            type: $field->type(),
            required: $field->isRequired(),
            defaultValue: self::resolveFieldDefault($definition, $field, $translationService, $locale),
            validationRules: $field->validationRules(),
            itemFields: $itemFieldDtos,
        );
    }

    private static function resolveTemplateLabel(
        TemplateDefinition $definition,
        ?TemplateTranslationService $translationService,
        ?string $locale,
    ): string {
        $labelKey = $definition->labelKey();

        if ($translationService !== null && $locale !== null && $labelKey !== null) {
            $translated = $translationService->translate($definition, $labelKey, $locale);

            if ($translated !== null) {
                return $translated;
            }
        }

        return $definition->label();
    }

    private static function resolveTemplateDescription(
        TemplateDefinition $definition,
        ?TemplateTranslationService $translationService,
        ?string $locale,
    ): ?string {
        $descriptionKey = $definition->descriptionKey();

        if ($translationService !== null && $locale !== null && $descriptionKey !== null) {
            $translated = $translationService->translate($definition, $descriptionKey, $locale);

            if ($translated !== null) {
                return $translated;
            }
        }

        return $definition->description();
    }

    private static function resolveFieldLabel(
        TemplateDefinition $definition,
        TemplateField $field,
        ?TemplateTranslationService $translationService,
        ?string $locale,
    ): string {
        $labelKey = $field->labelKey();

        if ($translationService !== null && $locale !== null && $labelKey !== null) {
            $translated = $translationService->translate($definition, $labelKey, $locale);

            if ($translated !== null) {
                return $translated;
            }
        }

        return $field->label();
    }

    private static function resolveFieldDefault(
        TemplateDefinition $definition,
        TemplateField $field,
        ?TemplateTranslationService $translationService,
        ?string $locale,
    ): mixed {
        $defaultKey = $field->defaultKey();

        if ($translationService !== null && $locale !== null && $defaultKey !== null) {
            $translated = $translationService->translate($definition, $defaultKey, $locale);

            if ($translated !== null) {
                return $translated;
            }
        }

        return $field->defaultValue();
    }

    /**
     * Builds an array payload from a TemplateFieldDto.
     *
     * @return array<string,mixed>
     */
    private static function mapFieldDtoToArray(TemplateFieldDto $field): array
    {
        $itemFields = array_map(
            static fn(TemplateFieldDto $itemField): array => self::mapFieldDtoToArray($itemField),
            $field->itemFields,
        );

        return [
            'name' => $field->name,
            'label' => $field->label,
            'type' => $field->type,
            'required' => $field->required,
            'default' => $field->defaultValue,
            'rules' => $field->validationRules,
            'item_fields' => $itemFields,
        ];
    }
}
