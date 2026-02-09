import { Badge } from '@/Components/Ui/badge';
import type { PageDto } from '@/Modules/ContentManagement/types';

/**
 * Small pill summarizing the publishing state of a page.
 *
 * Note: currently based on `is_published` only (Draft vs Published).
 */
export function StatusBadge({ page }: { page: PageDto }) {
  if (!page.is_published) {
    return (
      <Badge variant="outline" className="border-dashed">
        Draft
      </Badge>
    );
  }

  return <Badge variant="default">Published</Badge>;
}
