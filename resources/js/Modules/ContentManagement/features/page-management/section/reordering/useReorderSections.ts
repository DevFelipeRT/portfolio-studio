import { router } from '@inertiajs/react';
import React from 'react';

interface UseReorderSectionsOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

/**
 * Posts a new sections order for a given page.
 *
 * This hook contains only the side-effect (Inertia request) and remains UI-agnostic.
 * Any domain constraints (e.g. hero sections first) should be validated by the caller
 * before invoking this.
 */
export function useReorderSections(options: UseReorderSectionsOptions = {}) {
  return React.useCallback(
    (pageId: number, orderedIds: number[]): void => {
      router.post(
        route('admin.content.sections.reorder'),
        {
          page_id: pageId,
          ordered_ids: orderedIds,
        },
        {
          preserveScroll: options.preserveScroll ?? true,
          preserveState: options.preserveState ?? true,
        },
      );
    },
    [options.preserveScroll, options.preserveState],
  );
}
