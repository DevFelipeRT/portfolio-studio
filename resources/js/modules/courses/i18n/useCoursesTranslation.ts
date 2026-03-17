'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseCoursesTranslationResult = ScopedTranslationResult;

const useCoursesTranslationBase = createScopedTranslationHook('courses');

export function useCoursesTranslation(
  namespace?: Namespace,
): UseCoursesTranslationResult {
  return useCoursesTranslationBase(namespace);
}
