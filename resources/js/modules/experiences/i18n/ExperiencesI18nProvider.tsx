'use client';

import type { ReactNode } from 'react';
import { useContext, useEffect, useState } from 'react';
import { I18nContext } from '@/common/i18n';
import type { Locale } from '@/common/i18n/core/types';
import { experiencesTranslatorProvider } from './environment';

type ExperiencesI18nProviderProps = {
  children: ReactNode;
  loadingFallback?: ReactNode;
};

export function ExperiencesI18nProvider({
  children,
  loadingFallback = null,
}: ExperiencesI18nProviderProps) {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      'ExperiencesI18nProvider must be used within an I18nProvider.',
    );
  }

  const { locale } = context;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    experiencesTranslatorProvider
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

