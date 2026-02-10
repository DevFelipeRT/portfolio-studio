import { router } from '@inertiajs/react';
import React from 'react';
import type { EditSectionPayload } from '@/Modules/ContentManagement/features/page-management/section/dialogs/flows/edit/EditSectionDialog';

interface UseUpdateSectionOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

/**
 * Updates an existing section.
 */
export function useUpdateSection(options: UseUpdateSectionOptions = {}) {
  return React.useCallback(
    (sectionId: number, payload: EditSectionPayload): void => {
      router.put(
        route('admin.content.sections.update', sectionId),
        {
          template_key: payload.template_key,
          slot: payload.slot,
          anchor: payload.anchor,
          navigation_label: payload.navigation_label,
          is_active: payload.is_active,
          locale: payload.locale,
          data: payload.data,
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
