import type { PageSectionDto } from '@/modules/content-management/types';

import { useSortableSectionRow } from '../hooks';
import { getSectionRowMeta } from '../utils';
import { ReorderSectionControl } from './ReorderSectionControl';
import { SectionMetaBadges } from './SectionMetaBadges';
import { SectionToolbar } from './SectionToolbar';
import { SectionVisibilityBadge } from './SectionVisibilityBadge';

interface SectionItemProps {
  section: PageSectionDto;
  templateLabel: string;
  index: number;
  totalCount: number;
  reorderLocked?: boolean;
  onToggleActive?: (section: PageSectionDto) => void;
  onEdit?: (section: PageSectionDto) => void;
  onRemove?: (section: PageSectionDto) => void;
  onReorder?: (section: PageSectionDto, direction: 'up' | 'down') => void;
}

/**
 * Single section row used in the page edit sections list.
 */
export function SectionItem({
  section,
  templateLabel,
  index,
  totalCount,
  reorderLocked = false,
  onToggleActive,
  onEdit,
  onRemove,
  onReorder,
}: SectionItemProps) {
  const handleMoveUp = (): void => {
    if (!onReorder || reorderLocked) {
      return;
    }

    onReorder(section, 'up');
  };

  const handleMoveDown = (): void => {
    if (!onReorder || reorderLocked) {
      return;
    }

    onReorder(section, 'down');
  };

  const { canMoveUp, canMoveDown, navigationLabel, navigationGroup } =
    getSectionRowMeta(section, { index, totalCount });
  const { rowRef, dragHandleRef, dragHandleProps, style, isDragging } =
    useSortableSectionRow(section.id, reorderLocked);

  return (
    <li
      ref={rowRef}
      style={style}
      className={`bg-muted/40 flex items-stretch gap-2 rounded-md border px-3 py-2 ${
        isDragging ? 'opacity-80 shadow-sm' : ''
      }`}
    >
      <ReorderSectionControl
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        locked={reorderLocked}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        dragHandleRef={dragHandleRef}
        dragHandleProps={dragHandleProps}
      />

      <div className="flex flex-1 flex-col justify-center gap-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{templateLabel}</span>

          <SectionMetaBadges
            slot={section.slot}
            anchor={section.anchor}
            navigationLabel={navigationLabel}
            navigationGroup={navigationGroup}
          />

          <SectionVisibilityBadge section={section} />
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span>Position {section.position ?? '-'}</span>
          {section.locale && (
            <span className="tracking-wide uppercase">{section.locale}</span>
          )}
        </div>
      </div>

      <SectionToolbar
        section={section}
        onToggleActive={onToggleActive}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    </li>
  );
}
