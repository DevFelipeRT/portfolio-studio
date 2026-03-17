import { Badge } from '@/components/ui/badge';
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

  if (!page.is_published) {
    return (
      <Badge variant="outline" className="border-dashed">
        {tPages('listing.draft', 'Draft')}
      </Badge>
    );
  }

  return <Badge variant="default">{tPages('listing.published', 'Published')}</Badge>;
}
