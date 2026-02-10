import type { SectionData } from '@/Modules/ContentManagement/types';

export interface SectionDialogPayload {
  template_key: string;
  slot: string | null;
  anchor: string | null;
  navigation_label: string | null;
  is_active: boolean;
  locale: string | null;
  data: SectionData;
}