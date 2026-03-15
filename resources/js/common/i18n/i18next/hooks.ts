'use client';

import { useTranslation } from 'react-i18next';

/**
 * Returns the base react-i18next translation hook result backed by the shared
 * application runtime.
 */
export function useI18nextTranslation() {
  return useTranslation();
}
