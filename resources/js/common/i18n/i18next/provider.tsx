'use client';

import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18nRuntime } from './runtime';

/**
 * React provider that exposes the shared i18next runtime to descendant
 * components.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={getI18nRuntime()}>{children}</I18nextProvider>;
}
