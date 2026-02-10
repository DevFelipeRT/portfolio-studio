import type { SectionData } from '@/Modules/ContentManagement/types';

export function getNavigationGroup(data: SectionData): string {
  return typeof data.navigation_group === 'string' ? data.navigation_group : '';
}
