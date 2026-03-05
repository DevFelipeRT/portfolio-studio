'use client';

import type { PlaceholderValues } from '@/common/i18n';
import type { Namespace } from '@/common/i18n/types';
import { getI18next } from '@/common/i18n/i18next/i18next';
import { scopedNamespace } from '@/common/i18n/i18next/scopedNamespace';
import { useGetLocale } from '@/common/locale';

type TranslationFunction = {
  (key: string, params?: PlaceholderValues): string;
  (key: string, fallback: string, params?: PlaceholderValues): string;
};

export interface UseCoursesTranslationResult {
  locale: string;
  translate: TranslationFunction;
  setLocale(nextLocale: string): string;
}

export function useCoursesTranslation(
  namespace?: Namespace,
): UseCoursesTranslationResult {
  const locale = useGetLocale();

  const translateWithNamespace: TranslationFunction = (
    key: string,
    secondArgument?: PlaceholderValues | string,
    thirdArgument?: PlaceholderValues,
  ): string => {
    let parameters: PlaceholderValues | undefined;
    let fallbackText: string | undefined;

    if (typeof secondArgument === 'string') {
      fallbackText = secondArgument;
      parameters = thirdArgument;
    } else {
      parameters = secondArgument;
    }

    const ns = scopedNamespace('courses', namespace);
    if (!ns) {
      return fallbackText ?? key;
    }

    return getI18next().t(key, {
      lng: locale,
      ns,
      ...(fallbackText !== undefined ? { defaultValue: fallbackText } : {}),
      ...(parameters ? { ...parameters } : {}),
    });
  };

  return {
    locale,
    translate: translateWithNamespace,
    setLocale(nextLocale: string): string {
      const trimmed = nextLocale.trim();
      if (!trimmed) {
        return trimmed;
      }
      void getI18next().changeLanguage(trimmed);
      return trimmed;
    },
  };
}
