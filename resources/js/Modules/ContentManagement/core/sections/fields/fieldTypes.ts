import type {
    TemplateDefinitionDto,
    TemplateFieldDto,
    TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/core/types';

export function buildFieldTypeIndex(
    template?: TemplateDefinitionDto,
): Map<string, TemplateFieldPrimitiveType> {
    const index = new Map<string, TemplateFieldPrimitiveType>();

    if (!template || !Array.isArray(template.fields)) {
        return index;
    }

    for (const field of template.fields as TemplateFieldDto[]) {
        index.set(field.name, field.type);
    }

    return index;
}
