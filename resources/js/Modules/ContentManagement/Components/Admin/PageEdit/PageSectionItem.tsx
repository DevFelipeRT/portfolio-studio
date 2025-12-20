import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import { PageSectionReorderControl } from './PageSectionReorderControl';
import { PageSectionToolbar } from './PageSectionToolbar';
import { PageSectionVisibilityBadge } from './PageSectionVisibilityBadge';

interface PageSectionItemProps {
    section: PageSectionDto;
    templateLabel: string;
    index: number;
    totalCount: number;
    onToggleActive?: (section: PageSectionDto) => void;
    onEdit?: (section: PageSectionDto) => void;
    onRemove?: (section: PageSectionDto) => void;
    onReorder?: (section: PageSectionDto, direction: 'up' | 'down') => void;
}

/**
 * Single section row used in the page edit sections list.
 */
export function PageSectionItem({
    section,
    templateLabel,
    index,
    totalCount,
    onToggleActive,
    onEdit,
    onRemove,
    onReorder,
}: PageSectionItemProps) {
    const handleMoveUp = (): void => {
        if (!onReorder) {
            return;
        }

        onReorder(section, 'up');
    };

    const handleMoveDown = (): void => {
        if (!onReorder) {
            return;
        }

        onReorder(section, 'down');
    };

    const canMoveUp = index > 0;
    const canMoveDown = index < totalCount - 1;

    return (
        <li className="bg-muted/40 flex items-stretch gap-2 rounded-md border px-3 py-2">
            <PageSectionReorderControl
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
            />

            <div className="flex flex-1 flex-col justify-center gap-1 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{templateLabel}</span>

                    {section.slot && (
                        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                            Slot: {section.slot}
                        </span>
                    )}

                    {section.anchor && (
                        <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                            #{section.anchor}
                        </span>
                    )}

                    <PageSectionVisibilityBadge section={section} />
                </div>

                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                    <span>Position {section.position}</span>
                    {section.locale && (
                        <span className="tracking-wide uppercase">
                            {section.locale}
                        </span>
                    )}
                </div>
            </div>

            <PageSectionToolbar
                section={section}
                onToggleActive={onToggleActive}
                onEdit={onEdit}
                onRemove={onRemove}
            />
        </li>
    );
}
