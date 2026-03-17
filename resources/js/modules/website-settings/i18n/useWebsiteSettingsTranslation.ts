'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseWebsiteSettingsTranslationResult = ScopedTranslationResult;

const useWebsiteSettingsTranslationBase =
  createScopedTranslationHook('website-settings');

export function useWebsiteSettingsTranslation(
  namespace?: Namespace,
): UseWebsiteSettingsTranslationResult {
  return useWebsiteSettingsTranslationBase(namespace);
}
