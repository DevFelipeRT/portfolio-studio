<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Template;

use App\Modules\ContentManagement\Domain\ValueObjects\SlotName;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;

/**
 * Describes a content template available to the Content Management module.
 *
 * A template definition combines a unique template key, descriptive
 * metadata and the list of fields that define its schema.
 */
final class TemplateDefinition
{
    /**
     * Unique identifier for the template.
     */
    private TemplateKey $key;

    /**
     * Human-readable label for administrative UIs.
     */
    private string $label;

    /**
     * Short description of the template purpose.
     */
    private ?string $description;

    /**
     * Collection of logical layout slots where this template is allowed.
     *
     * @var array<int,SlotName>
     */
    private array $allowedSlots;

    /**
     * Collection of fields that define the template schema.
     *
     * @var array<int,TemplateField>
     */
    private array $fields;

    /**
     * Creates a new TemplateDefinition instance.
     *
     * @param array<int,SlotName>     $allowedSlots
     * @param array<int,TemplateField> $fields
     */
    public function __construct(
        TemplateKey $key,
        string $label,
        ?string $description,
        array $allowedSlots,
        array $fields,
    ) {
        $this->key = $key;
        $this->label = $label;
        $this->description = $description;
        $this->allowedSlots = $allowedSlots;
        $this->fields = $fields;
    }

    /**
     * Returns the template key.
     */
    public function key(): TemplateKey
    {
        return $this->key;
    }

    /**
     * Returns the label used in administrative UIs.
     */
    public function label(): string
    {
        return $this->label;
    }

    /**
     * Returns the template description.
     */
    public function description(): ?string
    {
        return $this->description;
    }

    /**
     * Returns the slots where the template is allowed.
     *
     * @return array<int,SlotName>
     */
    public function allowedSlots(): array
    {
        return $this->allowedSlots;
    }

    /**
     * Returns the fields that compose the template schema.
     *
     * @return array<int,TemplateField>
     */
    public function fields(): array
    {
        return $this->fields;
    }

    /**
     * Returns a field by its internal name or null when not present.
     */
    public function findField(string $name): ?TemplateField
    {
        foreach ($this->fields as $field) {
            if ($field->name() === $name) {
                return $field;
            }
        }

        return null;
    }
}
