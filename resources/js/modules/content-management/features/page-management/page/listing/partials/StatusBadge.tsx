import { TableBadge } from '@/common/table';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { PageDto } from '@/modules/content-management/types';

/**
 * Small pill summarizing the publishing state of a page.
 *
 * Note: currently based on `is_published` only (Draft vs Published).
 */
export function StatusBadge({ page }: { page: PageDto }) {
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );

  if (page.status === 'draft') {
    return (
      <TableBadge tone="outline" className="border-dashed font-medium">
        {tPages('listing.draft', 'Draft')}
      </TableBadge>
    );
  }

  if (page.status === 'archived') {
    return (
      <TableBadge tone="secondary" className="font-medium">
        {tPages('listing.archived', 'Archived')}
      </TableBadge>
    );
  }

  return (
    <TableBadge className="border-none font-medium">
      {tPages('listing.published', 'Published')}
    </TableBadge>
  );
}
