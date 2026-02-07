import {
  getSectionNavigationGroup,
  getSectionNavigationLabel,
} from '@/Modules/ContentManagement/core/sections/sectionNavigation';
import type { PageSectionDto } from '@/Modules/ContentManagement/core/types';
import { defaultStringNormalizer } from '@/Modules/ContentManagement/utils/strings';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SectionToolbar } from './SectionToolbar';
import { SectionVisibilityBadge } from './SectionVisibilityBadge';
import { ReorderSectionControl } from './ReorderSectionControl';

interface SectionItemProps {
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
export function SectionItem({
  section,
  templateLabel,
  index,
  totalCount,
  onToggleActive,
  onEdit,
  onRemove,
  onReorder,
}: SectionItemProps) {
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
  const navigationLabel = getSectionNavigationLabel(
    section,
    defaultStringNormalizer,
  );
  const navigationGroup = getSectionNavigationGroup(
    section,
    defaultStringNormalizer,
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });
  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={dragStyle}
      className={`bg-muted/40 flex items-stretch gap-2 rounded-md border px-3 py-2 ${
        isDragging ? 'opacity-80 shadow-sm' : ''
      }`}
    >
      <ReorderSectionControl
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
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

          {navigationLabel && (
            <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
              Nav: {navigationLabel}
            </span>
          )}

          {navigationGroup && (
            <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
              Group: {navigationGroup}
            </span>
          )}

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
