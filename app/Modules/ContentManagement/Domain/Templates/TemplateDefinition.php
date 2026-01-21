<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Templates;

use App\Modules\ContentManagement\Domain\ValueObjects\SlotName;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;

/**
 * Describes a content template available to the Content Management module.
 *
 * A template definition combines a unique template key, descriptive
 * metadata, the list of fields that define its schema and optional
 * data source configuration for dynamic content resolution.
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
     * Translation key for the label.
     */
    private ?string $labelKey;

    /**
     * Short description of the template purpose.
     */
    private ?string $description;

    /**
     * Translation key for the description.
     */
    private ?string $descriptionKey;

    /**
     * Template origin namespace (for example "content-management").
     */
    private string $origin;

    /**
     * Template directory name (for example "hero_primary").
     */
    private string $templateName;

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
     * Optional configuration describing how this template retrieves
     * dynamic data from an external source such as capabilities.
     */
    private ?TemplateDataSource $dataSource;

    /**
     * Creates a new TemplateDefinition instance.
     *
     * @param array<int,SlotName>      $allowedSlots
     * @param array<int,TemplateField> $fields
     */
    public function __construct(
        TemplateKey $key,
        string $label,
        ?string $description,
        array $allowedSlots,
        array $fields,
        ?TemplateDataSource $dataSource = null,
        ?string $labelKey = null,
        ?string $descriptionKey = null,
        string $origin = '',
        string $templateName = '',
    ) {
        $this->key = $key;
        $this->label = $label;
        $this->labelKey = $labelKey;
        $this->description = $description;
        $this->descriptionKey = $descriptionKey;
        $this->allowedSlots = $allowedSlots;
        $this->fields = $fields;
        $this->dataSource = $dataSource;
        $this->origin = $origin;
        $this->templateName = $templateName;
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
     * Returns the label translation key.
     */
    public function labelKey(): ?string
    {
        return $this->labelKey;
    }

    /**
     * Returns the template description.
     */
    public function description(): ?string
    {
        return $this->description;
    }

    /**
     * Returns the description translation key.
     */
    public function descriptionKey(): ?string
    {
        return $this->descriptionKey;
    }

    /**
     * Returns the template origin identifier.
     */
    public function origin(): string
    {
        return $this->origin;
    }

    /**
     * Returns the template directory name.
     */
    public function templateName(): string
    {
        return $this->templateName;
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

    /**
     * Returns the configured data source definition or null when
     * the template does not use an external data source.
     */
    public function dataSource(): ?TemplateDataSource
    {
        return $this->dataSource;
    }

    /**
     * Indicates whether this template declares an external data source.
     */
    public function hasDataSource(): bool
    {
        return $this->dataSource !== null;
    }
}
