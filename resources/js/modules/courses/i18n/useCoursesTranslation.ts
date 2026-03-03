'use client';

import { useContext } from 'react';
import { I18nContext, type PlaceholderValues } from '@/common/i18n';
import type { Locale, Namespace } from '@/common/i18n/core/types';
import { coursesTranslator } from './environment';

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
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error(
      'useCoursesTranslation must be used within an I18nProvider.',
    );
  }

  const { locale, setLocale } = context;

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

    const resolved = coursesTranslator.translate(
      locale as Locale,
      namespace,
      key,
      parameters,
    );

    if (fallbackText !== undefined) {
      if (!resolved || resolved === key) {
        return fallbackText;
      }
    }

    return resolved;
  };

  return {
    locale,
    translate: translateWithNamespace,
    setLocale,
  };
}
