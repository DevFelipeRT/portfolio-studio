'use client';

import type { Namespace, PlaceholderValues } from '../types';
import { useTranslation as useReactI18nextTranslation } from 'react-i18next';
import { useGetLocale } from '@/common/locale';
import { scopedNamespace } from '../i18next/scopedNamespace';

type TranslationFunction = {
  (key: string, params?: PlaceholderValues): string;
  (key: string, fallback: string, params?: PlaceholderValues): string;
};

export interface UseTranslationResult {
  locale: string;
  translate: TranslationFunction;
  setLocale(nextLocale: string): string;
}

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
export function useTranslation(namespace?: Namespace): UseTranslationResult {
  const locale = useGetLocale();
  const { i18n } = useReactI18nextTranslation();

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

    const ns = scopedNamespace('common', namespace);
    if (!ns) {
      return fallbackText ?? key;
    }

    return i18n.t(key, {
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
      void i18n.changeLanguage(trimmed);
      return trimmed;
    },
  };
}
