<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Templates;

/**
 * Describes a single configurable field within a template definition.
 *
 * Fields with type "collection" describe an item schema through nested item fields.
 */
final class TemplateField
{
    /**
     * Internal identifier used in payloads (for example "headline").
     */
    private string $name;

    /**
     * Human-readable label used in administrative forms.
     */
    private string $label;

    /**
     * Logical data type identifier (for example "string", "text", "boolean", "collection").
     */
    private string $type;

    /**
     * Indicates whether the field must be provided.
     */
    private bool $required;

    /**
     * Default value applied when no explicit value is provided.
     *
     * @var mixed
     */
    private mixed $defaultValue;

    /**
     * Validation rules applied to the field payload.
     *
     * Typically aligned with Laravel validation rule strings.
     *
     * @var array<int,string>
     */
    private array $validationRules;

    /**
     * Nested item fields when this field represents a collection.
     *
     * Each item field describes one property of the collection item payload.
     *
     * @var array<int,TemplateField>
     */
    private array $itemFields;

    /**
     * Creates a new TemplateField instance.
     *
     * @param array<int,string>       $validationRules
     * @param array<int,TemplateField> $itemFields
     */
    public function __construct(
        string $name,
        string $label,
        string $type,
        bool $required = false,
        mixed $defaultValue = null,
        array $validationRules = [],
        array $itemFields = [],
    ) {
        $this->name = $name;
        $this->label = $label;
        $this->type = $type;
        $this->required = $required;
        $this->defaultValue = $defaultValue;
        $this->validationRules = $validationRules;
        $this->itemFields = $itemFields;
    }

    /**
     * Returns the internal field name.
     */
    public function name(): string
    {
        return $this->name;
    }

    /**
     * Returns the label used in administrative UIs.
     */
    public function label(): string
    {
        return $this->label;
    }

    /**
     * Returns the logical data type identifier.
     */
    public function type(): string
    {
        return $this->type;
    }

    /**
     * Indicates whether the field is required.
     */
    public function isRequired(): bool
    {
        return $this->required;
    }

    /**
     * Returns the field default value.
     *
     * @return mixed
     */
    public function defaultValue(): mixed
    {
        return $this->defaultValue;
    }

    /**
     * Returns the validation rules configured for the field.
     *
     * @return array<int,string>
     */
    public function validationRules(): array
    {
        return $this->validationRules;
    }

    /**
     * Indicates whether this field represents a collection of items.
     */
    public function isCollection(): bool
    {
        return $this->type === 'collection';
    }

    /**
     * Returns the item fields when this field represents a collection.
     *
     * @return array<int,TemplateField>
     */
    public function itemFields(): array
    {
        return $this->itemFields;
    }
}
