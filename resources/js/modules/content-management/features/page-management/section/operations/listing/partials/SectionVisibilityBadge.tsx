import { Badge } from '@/components/ui/badge';
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

  if (status === 'inactive') {
    return (
      <Badge variant="outline" className="border-dashed">
        Inactive
      </Badge>
    );
  }

  if (status === 'scheduled') {
    return (
      <Badge
        variant="outline"
        className="border-primary/40 bg-primary/5 text-primary-foreground border text-xs"
      >
        Scheduled
      </Badge>
    );
  }

  if (status === 'expired') {
    return (
      <Badge variant="destructive" className="text-xs">
        Expired
      </Badge>
    );
  }

  return <Badge className="text-xs">Active</Badge>;
}
