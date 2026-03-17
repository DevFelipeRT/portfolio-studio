import { Badge } from '@/components/ui/badge';
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
      <Badge variant="outline" className="border-dashed">
        {tSections('visibility.inactive', 'Inactive')}
      </Badge>
    );
  }

  if (status === 'scheduled') {
    return (
      <Badge
        variant="outline"
        className="border-primary/40 bg-primary/5 text-primary-foreground border text-xs"
      >
        {tSections('visibility.scheduled', 'Scheduled')}
      </Badge>
    );
  }

  if (status === 'expired') {
    return (
      <Badge variant="destructive" className="text-xs">
        {tSections('visibility.expired', 'Expired')}
      </Badge>
    );
  }

  return <Badge className="text-xs">{tSections('visibility.active', 'Active')}</Badge>;
}
