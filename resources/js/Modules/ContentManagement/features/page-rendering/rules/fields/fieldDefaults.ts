import type {
    SectionData,
    SectionDataValue,
    TemplateDefinitionDto,
    TemplateFieldDto,
} from '@/Modules/ContentManagement/types';

export function buildTemplateDefaults(
    template?: TemplateDefinitionDto,
): SectionData {
    if (!template || !Array.isArray(template.fields)) {
        return {};
    }

    const defaults: SectionData = {};

    for (const field of template.fields as TemplateFieldDto[]) {
        if (field.default_value !== undefined) {
            defaults[field.name] = field.default_value as SectionDataValue;
        }
    }

    return defaults;
}
