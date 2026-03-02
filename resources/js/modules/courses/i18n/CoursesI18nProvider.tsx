'use client';

import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { I18nContext } from '@/common/i18n';
import type { Locale } from '@/common/i18n/core/types';
import { coursesTranslatorProvider } from './environment';

type CoursesI18nProviderProps = {
  children: ReactNode;
  loadingFallback?: ReactNode;
};

export function CoursesI18nProvider({
  children,
  loadingFallback = null,
}: CoursesI18nProviderProps) {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('CoursesI18nProvider must be used within an I18nProvider.');
  }

  const { locale } = context;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    coursesTranslatorProvider
      .preloadLocale(locale as Locale)
      .catch(() => null)
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (!ready) {
    return <>{loadingFallback}</>;
  }

  return <>{children}</>;
}

