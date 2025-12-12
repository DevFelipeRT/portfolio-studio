import { Badge } from '@/Components/Ui/badge';
import type { PageDto } from '@/Modules/ContentManagement/types';

/**
 * Small pill that summarizes the publishing state of a page.
 */
export function PageStatusBadge({ page }: { page: PageDto }) {
    if (!page.is_published) {
        return (
            <Badge variant="outline" className="border-dashed">
                Draft
            </Badge>
        );
    }

    return <Badge variant="default">Published</Badge>;
}
