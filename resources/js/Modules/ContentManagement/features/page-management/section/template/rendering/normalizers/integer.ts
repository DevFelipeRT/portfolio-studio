import type { SectionDataValue } from '@/Modules/ContentManagement/types';

export function normalizeInteger(
  value: SectionDataValue | undefined,
): number | null {
  return typeof value === 'number' && Number.isInteger(value) ? value : null;
}
