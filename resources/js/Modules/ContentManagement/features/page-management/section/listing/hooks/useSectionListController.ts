import React from 'react';
import { toast } from 'sonner';

import type { DragEndEvent } from '@dnd-kit/core';

import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import {
  applyPermutation,
  swapAdjacent,
  useReorderSections,
} from '@/Modules/ContentManagement/features/page-management/section/ordering';

import { useOrderedSections } from './internal/useOrderedSections';
import { useSectionsDragOrdering } from './internal/useSectionsDragOrdering';

export interface UseSectionListControllerArgs {
  pageId: number;
  sections: PageSectionDto[];
  notifyError?: (message: string) => void;
}

function getFirstErrorMessage(errors: Record<string, unknown>): string {
  const firstError = Object.values(errors).find((value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.some(
        (item) => typeof item === 'string' && item.trim().length > 0,
      );
    }

    return false;
  });

  if (typeof firstError === 'string') {
    return firstError;
  }

  if (Array.isArray(firstError)) {
    const nestedError = firstError.find(
      (item) => typeof item === 'string' && item.trim().length > 0,
    );

    if (typeof nestedError === 'string') {
      return nestedError;
    }
  }

  return 'Unable to reorder sections.';
}

/**
 * Orchestrates the sections list use-case for the page edit screen.
 *
 * Responsibilities:
 * - keep an optimistic, locally-ordered list in sync with server props
 * - persist reorder requests and lock UI while saving
 * - revert to last server state on validation errors
 *
 * This hook is designed to feed the presentational `SectionList` component.
 */
export function useSectionListController({
  pageId,
  sections,
  notifyError,
}: UseSectionListControllerArgs) {
  const reorderSections = useReorderSections();
  const { orderedSections, setOrderedSections } = useOrderedSections(sections);

  const lastSyncedSectionsRef = React.useRef(sections);
  React.useEffect(() => {
    lastSyncedSectionsRef.current = sections;
  }, [sections]);

  const [reorderLocked, setReorderLocked] = React.useState(false);

  const submitReorder = React.useCallback(
    (orderedIds: Array<PageSectionDto['id']>): void => {
      if (reorderLocked) {
        return;
      }

      setReorderLocked(true);

      reorderSections(pageId, orderedIds, {
        onError: (errors) => {
          (notifyError ?? toast.error)(getFirstErrorMessage(errors));
          setOrderedSections(lastSyncedSectionsRef.current);
        },
        onFinish: () => {
          setReorderLocked(false);
        },
      });
    },
    [notifyError, pageId, reorderLocked, reorderSections, setOrderedSections],
  );

  const handleMove = React.useCallback(
    (nextSections: PageSectionDto[]): void => {
      if (reorderLocked) {
        return;
      }

      setOrderedSections(nextSections);
      submitReorder(nextSections.map((section) => section.id));
    },
    [reorderLocked, setOrderedSections, submitReorder],
  );

  const { sensors, handleDragEnd } = useSectionsDragOrdering({
    orderedSections,
    onMove: handleMove,
    isLocked: reorderLocked,
  });

  const handleReorderSection = React.useCallback(
    (section: PageSectionDto, direction: 'up' | 'down'): void => {
      if (reorderLocked) {
        return;
      }

      const nextIds = swapAdjacent(orderedSections, section.id, direction);
      const nextSections = applyPermutation(orderedSections, nextIds);
      setOrderedSections(nextSections);
      submitReorder(nextIds);
    },
    [orderedSections, reorderLocked, setOrderedSections, submitReorder],
  );

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      handleDragEnd(event);
    },
    [handleDragEnd],
  );

  return {
    sections: orderedSections,
    reorderLocked,
    sensors,
    onDragEnd,
    onReorder: handleReorderSection,
  };
}
