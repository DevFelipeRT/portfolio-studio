'use client';

import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18nRuntime } from '../runtime';

export function I18nRuntimeProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={getI18nRuntime()}>{children}</I18nextProvider>;
}
