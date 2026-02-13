import {
  getSectionNavigationGroup,
  getSectionNavigationLabel,
} from '@/modules/content-management/features/page-management/section/navigation';
import type { PageSectionDto } from '@/modules/content-management/types';
import type { StringNormalizer } from '@/modules/content-management/types/strings';
import { defaultStringNormalizer } from '@/modules/content-management/utils/strings';

interface SectionRowMetaInput {
  index: number;
  totalCount: number;
  normalizer?: StringNormalizer;
}

/**
 * UI-facing metadata derived from a section and its position in the list.
 */
export function getSectionRowMeta(
  section: PageSectionDto,
  {
    index,
    totalCount,
    normalizer = defaultStringNormalizer,
  }: SectionRowMetaInput,
) {
  const canMoveUp = index > 0;
  const canMoveDown = index < totalCount - 1;
  const navigationLabel = getSectionNavigationLabel(section, normalizer);
  const navigationGroup = getSectionNavigationGroup(section, normalizer);

  return {
    canMoveUp,
    canMoveDown,
    navigationLabel,
    navigationGroup,
  };
}
