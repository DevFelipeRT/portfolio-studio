import { Badge } from '@/Components/Ui/badge';
import type { PageSectionDto } from '@/Modules/ContentManagement/core/types';

/**
 * Small badge that summarizes the current visibility state of a section.
 */
export function SectionVisibilityBadge({
    section,
}: {
    section: PageSectionDto;
}) {
    const now = new Date();
    const from = section.visible_from ? new Date(section.visible_from) : null;
    const until = section.visible_until
        ? new Date(section.visible_until)
        : null;

    if (!section.is_active) {
        return (
            <Badge variant="outline" className="border-dashed">
                Inactive
            </Badge>
        );
    }

    if (from && from.getTime() > now.getTime()) {
        return (
            <Badge
                variant="outline"
                className="border-primary/40 bg-primary/5 text-primary-foreground border text-xs"
            >
                Scheduled
            </Badge>
        );
    }

    if (until && until.getTime() < now.getTime()) {
        return (
            <Badge variant="destructive" className="text-xs">
                Expired
            </Badge>
        );
    }

    return <Badge className="text-xs">Active</Badge>;
}
