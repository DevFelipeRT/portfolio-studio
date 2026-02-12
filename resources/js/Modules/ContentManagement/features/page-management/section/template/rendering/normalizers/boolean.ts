import type { SectionDataValue } from '@/Modules/ContentManagement/types';

export function normalizeBoolean(value: SectionDataValue | undefined): boolean {
  return typeof value === 'boolean' ? value : false;
}
