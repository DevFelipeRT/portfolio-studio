import type { DragEndEvent } from '@dnd-kit/core';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React from 'react';

import type { PageSectionDto } from '@/Modules/ContentManagement/types';

interface UseSectionsDragOrderingOptions {
  orderedSections: PageSectionDto[];
  setOrderedSections: React.Dispatch<React.SetStateAction<PageSectionDto[]>>;
  onReorderIds?: (orderedIds: Array<PageSectionDto['id']>) => void;
  onValidateReorder?: (orderedSections: PageSectionDto[]) => boolean;
}

/**
 * Provides DnD-kit sensors + drag handler for reordering page sections.
 *
 * This hook is intentionally UI-agnostic:
 * it updates local ordered state and emits the resulting ids to the caller.
 */
export function useSectionsDragOrdering({
  orderedSections,
  setOrderedSections,
  onReorderIds,
  onValidateReorder,
}: UseSectionsDragOrderingOptions) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent): void => {
      if (!event.over || event.active.id === event.over.id) {
        return;
      }

      const oldIndex = orderedSections.findIndex(
        (section) => section.id === event.active.id,
      );
      const newIndex = orderedSections.findIndex(
        (section) => section.id === event.over?.id,
      );

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const nextSections = arrayMove(orderedSections, oldIndex, newIndex);

      if (onValidateReorder && !onValidateReorder(nextSections)) {
        return;
      }

      setOrderedSections(nextSections);
      onReorderIds?.(nextSections.map((section) => section.id));
    },
    [onReorderIds, onValidateReorder, orderedSections, setOrderedSections],
  );

  return { sensors, handleDragEnd };
}

