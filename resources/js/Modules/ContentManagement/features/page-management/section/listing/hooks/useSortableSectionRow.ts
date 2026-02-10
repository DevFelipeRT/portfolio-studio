import type { ButtonHTMLAttributes } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * dnd-kit wiring for a sortable section row.
 *
 * Exposes both the row ref (for transforms) and the drag handle ref/props.
 */
export function useSortableSectionRow(sectionId: number) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });

  return {
    rowRef: setNodeRef,
    dragHandleRef: setActivatorNodeRef,
    dragHandleProps: {
      ...(attributes as unknown as ButtonHTMLAttributes<HTMLButtonElement>),
      ...(listeners as unknown as ButtonHTMLAttributes<HTMLButtonElement>),
    },
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
    },
    isDragging,
  };
}

