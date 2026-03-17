'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseExperiencesTranslationResult = ScopedTranslationResult;

const useExperiencesTranslationBase =
  createScopedTranslationHook('experiences');

export function useExperiencesTranslation(
  namespace?: Namespace,
): UseExperiencesTranslationResult {
  return useExperiencesTranslationBase(namespace);
}
