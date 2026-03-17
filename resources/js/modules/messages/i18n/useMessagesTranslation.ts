'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseMessagesTranslationResult = ScopedTranslationResult;

const useMessagesTranslationBase = createScopedTranslationHook('messages');

export function useMessagesTranslation(
  namespace?: Namespace,
): UseMessagesTranslationResult {
  return useMessagesTranslationBase(namespace);
}
