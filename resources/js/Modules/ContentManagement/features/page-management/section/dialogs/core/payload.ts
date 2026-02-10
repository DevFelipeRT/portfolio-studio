import type { SectionData } from '@/Modules/ContentManagement/types';
import { SectionDialogPayload } from './types';

export interface SectionDialogState {
  templateKey: string;
  slot: string;
  anchor: string;
  navigationLabel: string;
  isActive: boolean;
  data: SectionData;
}

interface BuildSectionPayloadArgs {
  state: SectionDialogState;
  locale: string | null;
}

export function buildSectionPayload({
  state,
  locale,
}: BuildSectionPayloadArgs): SectionDialogPayload {
  return {
    template_key: state.templateKey,
    slot: state.slot || null,
    anchor: state.anchor || null,
    navigation_label: state.navigationLabel || null,
    is_active: state.isActive,
    locale,
    data: state.data,
  };
}

