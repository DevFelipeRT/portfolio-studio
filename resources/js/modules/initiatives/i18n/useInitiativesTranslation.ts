'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseInitiativesTranslationResult = ScopedTranslationResult;

const useInitiativesTranslationBase = createScopedTranslationHook('initiatives');

export function useInitiativesTranslation(
  namespace?: Namespace,
): UseInitiativesTranslationResult {
  return useInitiativesTranslationBase(namespace);
}
