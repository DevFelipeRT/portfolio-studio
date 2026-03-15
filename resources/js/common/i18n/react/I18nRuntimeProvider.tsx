'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '../i18next';

export function I18nRuntimeProvider({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
