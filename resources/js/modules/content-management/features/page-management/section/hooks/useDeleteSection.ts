import { router } from '@inertiajs/react';
import React from 'react';

interface UseDeleteSectionOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

/**
 * Deletes a section.
 */
export function useDeleteSection(options: UseDeleteSectionOptions = {}) {
  return React.useCallback(
    (sectionId: number): void => {
      router.delete(route('admin.content.sections.destroy', sectionId), {
        preserveScroll: options.preserveScroll ?? true,
        preserveState: options.preserveState ?? true,
      });
    },
    [options.preserveScroll, options.preserveState],
  );
}
