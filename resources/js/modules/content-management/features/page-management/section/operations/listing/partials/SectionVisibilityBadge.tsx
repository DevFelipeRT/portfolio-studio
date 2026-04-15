import { InfoBadge } from '@/components/badges';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { PageSectionDto } from '@/modules/content-management/types';

import { getSectionVisibilityStatus } from '../utils';

/**
 * Small badge that summarizes the current visibility state of a section.
 */
export function SectionVisibilityBadge({
  section,
}: {
  section: PageSectionDto;
}) {
  const status = getSectionVisibilityStatus(section);
  const { translate: tSections } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.sections,
  );

  if (status === 'inactive') {
    return (
      <InfoBadge tone="outline" className="border-dashed">
        {tSections('visibility.inactive', 'Inactive')}
      </InfoBadge>
    );
  }

  if (status === 'scheduled') {
    return (
      <InfoBadge
        tone="outline"
        className="border-primary/40 bg-primary/5 text-primary"
      >
        {tSections('visibility.scheduled', 'Scheduled')}
      </InfoBadge>
    );
  }

  if (status === 'expired') {
    return (
      <InfoBadge tone="destructive">
        {tSections('visibility.expired', 'Expired')}
      </InfoBadge>
    );
  }

  return <InfoBadge tone="default">{tSections('visibility.active', 'Active')}</InfoBadge>;
}
