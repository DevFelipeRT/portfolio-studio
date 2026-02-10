import { router } from '@inertiajs/react';
import React from 'react';
import type { CreateSectionPayload } from '@/Modules/ContentManagement/features/page-management/section/dialogs';

interface UseCreateSectionOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

/**
 * Creates a new section for a given page.
 */
export function useCreateSection(
  pageId: number,
  options: UseCreateSectionOptions = {},
) {
  return React.useCallback(
    (payload: CreateSectionPayload): void => {
      router.post(
        route('admin.content.sections.store'),
        {
          page_id: pageId,
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
    [options.preserveScroll, options.preserveState, pageId],
  );
}
