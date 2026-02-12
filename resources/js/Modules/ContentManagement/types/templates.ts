/**
 * Represents the supported primitive field kinds for template-driven sections.
 */
export type TemplateFieldPrimitiveType =
    | 'string'
    | 'text'
    | 'rich_text'
    | 'integer'
    | 'boolean'
    | 'array_integer'
    | 'collection'
    | 'image'
    | 'image_gallery';

/**
 * Describes a single field inside a template definition.
 */
export interface TemplateFieldDto {
    name: string;
    label: string;
    type: TemplateFieldPrimitiveType;
    required: boolean;
    default_value: unknown;
    validation_rules: string[];
    item_fields?: TemplateFieldDto[];
}

/**
 * Describes a template definition that can be used to instantiate page sections.
 */
export interface TemplateDefinitionDto {
    key: string;
    label: string;
    description: string | null;
    allowed_slots: string[];
    fields: TemplateFieldDto[];
    origin: string;
    template_name: string;
}

