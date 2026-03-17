'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseProjectsTranslationResult = ScopedTranslationResult;

const useProjectsTranslationBase = createScopedTranslationHook('projects');

export function useProjectsTranslation(
  namespace?: Namespace,
): UseProjectsTranslationResult {
  return useProjectsTranslationBase(namespace);
}
