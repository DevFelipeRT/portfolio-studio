import { InfoBadge } from '@/components/badges';
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
      <InfoBadge tone="outline" className="border-dashed">
        {tPages('listing.draft', 'Draft')}
      </InfoBadge>
    );
  }

  if (page.status === 'archived') {
    return (
      <InfoBadge tone="secondary">
        {tPages('listing.archived', 'Archived')}
      </InfoBadge>
    );
  }

  return (
    <InfoBadge tone="default" className="border-none">
      {tPages('listing.published', 'Published')}
    </InfoBadge>
  );
}
