'use client';

import type { Namespace } from '@/common/i18n/types';
import {
  createScopedTranslationHook,
  type ScopedTranslationResult,
} from '@/common/i18n/react/hooks/createScopedTranslationHook';

export type UseSkillsTranslationResult = ScopedTranslationResult;

const useSkillsTranslationBase = createScopedTranslationHook('skills');

export function useSkillsTranslation(
  namespace?: Namespace,
): UseSkillsTranslationResult {
  return useSkillsTranslationBase(namespace);
}
