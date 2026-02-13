import type { TemplateDefinitionDto } from '@/modules/content-management/types';

export function findTemplateDefinition(
  templates: TemplateDefinitionDto[] | undefined,
  template_key: string,
): TemplateDefinitionDto | undefined {
  if (!templates || !templates.length) {
    return undefined;
  }

  return templates.find((template) => template.key === template_key);
}
