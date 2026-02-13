import type {
  SectionData,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import { withNavigationGroupInData } from '../navigation';
import { SectionDialogPayload } from '../types';

export interface SectionDialogState {
  templateKey: string;
  slot: string;
  anchor: string;
  navigationLabel: string;
  navigationGroup: string;
  isActive: boolean;
  templateData: SectionData;
}

interface BuildSectionPayloadArgs {
  state: SectionDialogState;
  locale: string | null;
  template?: TemplateDefinitionDto | null;
}

function buildDataPayload(
  template: TemplateDefinitionDto | null,
  templateData: SectionData,
  navigationGroup: string,
): SectionData {
  const base: SectionData = template ? {} : { ...templateData };

  if (template) {
    const allowed = new Set(template.fields.map((field) => field.name));

    Object.keys(templateData).forEach((key) => {
      if (allowed.has(key)) {
        base[key] = templateData[key];
      }
    });
  }

  return withNavigationGroupInData(base, navigationGroup);
}

export function buildSectionPayload({
  state,
  locale,
  template = null,
}: BuildSectionPayloadArgs): SectionDialogPayload {
  return {
    template_key: state.templateKey,
    slot: state.slot || null,
    anchor: state.anchor || null,
    navigation_label: state.navigationLabel || null,
    is_active: state.isActive,
    locale,
    data: buildDataPayload(template, state.templateData, state.navigationGroup),
  };
}
