import type { DragEndEvent } from '@dnd-kit/core';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React from 'react';

import type { PageSectionDto } from '@/modules/content-management/types';

interface UseSectionsDragOrderingOptions {
  orderedSections: PageSectionDto[];
  onMove?: (nextSections: PageSectionDto[]) => void;
  isLocked?: boolean;
}

/**
 * Provides DnD-kit sensors + drag handler for reordering page sections.
 *
 * This hook is intentionally UI-agnostic:
 * it derives a next list order and notifies the caller via `onMove`.
 */
export function useSectionsDragOrdering({
  orderedSections,
  onMove,
  isLocked = false,
}: UseSectionsDragOrderingOptions) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent): void => {
      if (isLocked) {
        return;
      }

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

      onMove?.(nextSections);
    },
    [isLocked, onMove, orderedSections],
  );

  return { sensors, handleDragEnd };
}
