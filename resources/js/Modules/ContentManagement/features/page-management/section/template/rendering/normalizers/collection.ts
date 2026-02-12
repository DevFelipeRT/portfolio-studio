import type { SectionDataValue } from '@/Modules/ContentManagement/types';

export function normalizeCollection(
  value: SectionDataValue | undefined,
): SectionDataValue {
  return value ?? [];
}
