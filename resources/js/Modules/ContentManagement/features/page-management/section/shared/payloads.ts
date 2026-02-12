import type { SectionData } from '@/Modules/ContentManagement/types';

export interface BaseSectionPayload {
  template_key: string;
  slot: string | null;
  anchor: string | null;
  navigation_label: string | null;
  is_active: boolean;
  locale: string | null;
  data: SectionData;
}

export type CreateSectionPayload = BaseSectionPayload;
export type UpdateSectionPayload = BaseSectionPayload;

// Legacy alias used by dialog internals.
export type SectionDialogPayload = BaseSectionPayload;
