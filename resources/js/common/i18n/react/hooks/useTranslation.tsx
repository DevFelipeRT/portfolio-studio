'use client';

import type { Namespace } from '../../types';
import { createScopedTranslationHook } from './createScopedTranslationHook';
import type { ScopedTranslationResult } from './createScopedTranslationHook';

export type UseTranslationResult = ScopedTranslationResult;

/**
 * useTranslation exposes the current locale and a namespaced
 * translation function backed by i18next.
 *
 * The translation function supports an optional fallback:
 * - translate('key')
 * - translate('key', params)
 * - translate('key', 'Fallback text')
 * - translate('key', 'Fallback text', params)
 */
const useCommonTranslationBase = createScopedTranslationHook('common');

export function useTranslation(namespace?: Namespace): UseTranslationResult {
  return useCommonTranslationBase(namespace);
}
