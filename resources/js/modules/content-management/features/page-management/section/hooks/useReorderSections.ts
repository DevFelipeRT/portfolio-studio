import { router } from '@inertiajs/react';
import React from 'react';

import type { PageSectionDto } from '@/modules/content-management/types';

interface UseReorderSectionsOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
}

export interface ReorderSectionsSuccessPayload {
  page: unknown;
  requestedOrderedIds: Array<PageSectionDto['id']>;
}

export interface ReorderSectionsCallbacks {
  onSuccess?: (payload: ReorderSectionsSuccessPayload) => void;
  onError?: (errors: Record<string, unknown>) => void;
  onFinish?: () => void;
}

/**
 * Persists a new sections order for a given page.
 *
 * Notes:
 * - This hook contains only the persistence side-effect (Inertia request) and remains UI-agnostic.
 * - It does not interpret the returned `page` payload; callers decide how to sync UI from server props.
 * - Any domain constraints (e.g. hero sections first) should be validated by the caller before invoking.
 */
export function useReorderSections(options: UseReorderSectionsOptions = {}) {
  return React.useCallback(
    (
      pageId: number,
      orderedIds: Array<PageSectionDto['id']>,
      callbacks: ReorderSectionsCallbacks = {},
    ): void => {
      router.post(
        route('admin.content.sections.reorder'),
        {
          page_id: pageId,
          ordered_ids: orderedIds,
        },
        {
          preserveScroll: options.preserveScroll ?? true,
          preserveState: options.preserveState ?? true,
          onSuccess: (page) => {
            callbacks.onSuccess?.({ page, requestedOrderedIds: orderedIds });
          },
          onError: (errors) => {
            callbacks.onError?.(errors as Record<string, unknown>);
          },
          onFinish: () => {
            callbacks.onFinish?.();
          },
        },
      );
    },
    [options.preserveScroll, options.preserveState],
  );
}
