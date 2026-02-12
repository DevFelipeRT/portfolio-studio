import type { SectionDataValue } from '@/Modules/ContentManagement/types';

export function normalizeString(value: SectionDataValue | undefined): string {
  return typeof value === 'string' ? value : '';
}
