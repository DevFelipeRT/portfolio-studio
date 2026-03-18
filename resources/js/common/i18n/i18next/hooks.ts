'use client';

import type { Namespace } from '../types';
import { useTranslation } from 'react-i18next';

/**
 * Returns the base react-i18next translation hook result backed by the shared
 * application runtime.
 *
 * Accepting an optional namespace lets callers subscribe to resource-loading
 * events for specific bundles, which is important when scoped translations are
 * preloaded asynchronously after the first render.
 */
export function useI18nextTranslation(namespace?: Namespace | Namespace[]) {
  return useTranslation(namespace);
}
