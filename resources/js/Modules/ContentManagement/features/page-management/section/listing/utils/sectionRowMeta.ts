import {
  getSectionNavigationGroup,
  getSectionNavigationLabel,
} from '@/Modules/ContentManagement/features/page-rendering';
import type { StringNormalizer } from '@/Modules/ContentManagement/features/page-rendering';
import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import { defaultStringNormalizer } from '@/Modules/ContentManagement/shared/strings';

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
  { index, totalCount, normalizer = defaultStringNormalizer }: SectionRowMetaInput,
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
