'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseImagesTranslationResult = ScopedTranslationResult;

const useImagesTranslationBase = createScopedTranslationHook('images');

export function useImagesTranslation(
  namespace?: Namespace,
): UseImagesTranslationResult {
  return useImagesTranslationBase(namespace);
}
