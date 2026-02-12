import type { SectionData } from '@/Modules/ContentManagement/types';

export const NAVIGATION_GROUP_FIELD = 'navigation_group';

export function getNavigationGroupFromData(
  data: SectionData | null | undefined,
): string {
  const value = data?.[NAVIGATION_GROUP_FIELD];
  return typeof value === 'string' ? value : '';
}

export function stripNavigationGroupFromData(
  data: SectionData | null | undefined,
): SectionData {
  const templateData = { ...(data ?? {}) };
  delete templateData[NAVIGATION_GROUP_FIELD];
  return templateData;
}

export function withNavigationGroupInData(
  data: SectionData,
  navigationGroup: string,
): SectionData {
  const base = stripNavigationGroupFromData(data);
  const group = navigationGroup.trim();

  if (!group) {
    return base;
  }

  return {
    ...base,
    [NAVIGATION_GROUP_FIELD]: group,
  };
}
