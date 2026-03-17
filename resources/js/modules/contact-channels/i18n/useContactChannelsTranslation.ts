'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseContactChannelsTranslationResult = ScopedTranslationResult;

const useContactChannelsTranslationBase =
  createScopedTranslationHook('contact-channels');

export function useContactChannelsTranslation(
  namespace?: Namespace,
): UseContactChannelsTranslationResult {
  return useContactChannelsTranslationBase(namespace);
}
