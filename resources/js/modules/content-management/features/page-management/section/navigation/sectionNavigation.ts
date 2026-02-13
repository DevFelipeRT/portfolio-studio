import type { PageSectionDto } from '@/modules/content-management/types';
import type { StringNormalizer } from '@/modules/content-management/types/strings';
import { getNavigationGroupFromData } from './data';

type SectionNavigationMetadata = {
  label: string | null;
  group: string | null;
  targetId: string | null;
};

function resolveSectionNavigationMetadata(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): SectionNavigationMetadata {
  const data = section.data ?? {};
  const label = normalizer.normalize(section.navigation_label);

  return {
    label: label ?? normalizer.normalize(data.navigation_label),
    group: normalizer.normalize(getNavigationGroupFromData(data)),
    targetId: normalizer.normalize(section.anchor),
  };
}

export function getSectionNavigationLabel(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): string | null {
  return resolveSectionNavigationMetadata(section, normalizer).label;
}

export function getSectionNavigationGroup(
  section: PageSectionDto,
  normalizer: StringNormalizer,
): string | null {
  return resolveSectionNavigationMetadata(section, normalizer).group;
}
