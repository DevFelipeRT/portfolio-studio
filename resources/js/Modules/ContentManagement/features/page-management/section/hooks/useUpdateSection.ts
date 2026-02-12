import { router } from '@inertiajs/react';
import React from 'react';
import type { UpdateSectionPayload } from '@/Modules/ContentManagement/features/page-management/section/shared';

interface UseUpdateSectionOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

/**
 * Updates an existing section.
 */
export function useUpdateSection(options: UseUpdateSectionOptions = {}) {
  return React.useCallback(
    (sectionId: number, payload: UpdateSectionPayload): void => {
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
