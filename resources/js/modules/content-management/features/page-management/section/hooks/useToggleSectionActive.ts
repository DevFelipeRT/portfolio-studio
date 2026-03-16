import { pageRouter } from '@/common/page-runtime';
import React from 'react';

interface UseToggleSectionActiveOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

/**
 * Toggles the active status of a section.
 */
export function useToggleSectionActive(
  options: UseToggleSectionActiveOptions = {},
) {
  return React.useCallback(
    (sectionId: number, nextIsActive: boolean): void => {
      pageRouter.post(
        route('admin.content.sections.toggle-active', sectionId),
        { is_active: nextIsActive },
        {
          preserveScroll: options.preserveScroll ?? true,
          preserveState: options.preserveState ?? true,
        },
      );
    },
    [options.preserveScroll, options.preserveState],
  );
}
