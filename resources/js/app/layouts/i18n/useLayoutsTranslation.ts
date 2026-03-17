'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseLayoutsTranslationResult = ScopedTranslationResult;

const useLayoutsTranslationBase = createScopedTranslationHook('layouts');

export function useLayoutsTranslation(
  namespace?: Namespace,
): UseLayoutsTranslationResult {
  return useLayoutsTranslationBase(namespace);
}
