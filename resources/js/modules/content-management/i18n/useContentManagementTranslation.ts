'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseContentManagementTranslationResult = ScopedTranslationResult;

const useContentManagementTranslationBase =
  createScopedTranslationHook('content-management');

export function useContentManagementTranslation(
  namespace?: Namespace,
): UseContentManagementTranslationResult {
  return useContentManagementTranslationBase(namespace);
}
