import type { SectionDataValue } from '@/Modules/ContentManagement/types';

export function normalizeArrayInteger(
  value: SectionDataValue | undefined,
): number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number')
    ? (value as number[])
    : [];
}
