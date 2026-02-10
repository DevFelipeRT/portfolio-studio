import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import type { TemplateFilterMode } from './types';

interface FilterTemplatesArgs {
  templates: TemplateDefinitionDto[];
  filterMode: TemplateFilterMode;
  originFilter: string;
}

/**
 * Applies the selection step filters to the template list.
 */
export function filterTemplates({
  templates,
  filterMode,
  originFilter,
}: FilterTemplatesArgs): TemplateDefinitionDto[] {
  if (filterMode === 'generic') {
    return templates.filter(
      (template) => template.origin === 'content-management',
    );
  }

  if (filterMode === 'domain') {
    const candidates = templates.filter(
      (template) => template.origin !== 'content-management',
    );

    if (!originFilter) {
      return candidates;
    }

    return candidates.filter((template) => template.origin === originFilter);
  }

  if (originFilter) {
    return templates.filter((template) => template.origin === originFilter);
  }

  return templates;
}
