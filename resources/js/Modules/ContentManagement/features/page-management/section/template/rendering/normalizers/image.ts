import type { SectionDataValue } from '@/Modules/ContentManagement/types';

export function normalizeImage(
  value: SectionDataValue | undefined,
): number | null {
  return typeof value === 'number' ? value : null;
}
