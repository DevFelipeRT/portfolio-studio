import type {
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';

interface BuildInitialSectionDataOptions {
    previousData?: SectionData | null;
}

export function buildInitialSectionData(
    template: TemplateDefinitionDto,
    options: BuildInitialSectionDataOptions = {},
): SectionData {
    const initial: SectionData = {};
    const previousNavigationGroup =
        typeof options.previousData?.navigation_group === 'string'
            ? options.previousData.navigation_group
            : '';

    for (const field of template.fields) {
        if (field.default_value !== null && field.default_value !== undefined) {
            initial[field.name] = field.default_value as never;
            continue;
        }

        switch (field.type) {
            case 'boolean':
                initial[field.name] = false as never;
                break;
            case 'integer':
                initial[field.name] = null as never;
                break;
            case 'array_integer':
                initial[field.name] = [] as never;
                break;
            default:
                initial[field.name] = '' as never;
                break;
        }
    }

    if (previousNavigationGroup.trim()) {
        initial.navigation_group = previousNavigationGroup;
    }

    return initial;
}
