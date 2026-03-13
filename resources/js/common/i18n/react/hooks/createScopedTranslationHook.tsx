'use client';

import type { Namespace, PlaceholderValues } from '../../types';
import { scopedNamespace } from '../../i18next/scopedNamespace';
import { getI18nRuntime } from '../../runtime';
import { useGetI18nLocale } from './useGetI18nLocale';

type TranslationFunction = {
  (key: string, params?: PlaceholderValues): string;
  (key: string, fallback: string, params?: PlaceholderValues): string;
};

export type ScopedTranslationResult = {
  locale: string;
  translate: TranslationFunction;
  setLocale(nextLocale: string): string;
};

export function createScopedTranslationHook(scopeId: string) {
  return function useScopedTranslation(
    namespace?: Namespace,
  ): ScopedTranslationResult {
    const locale = useGetI18nLocale();

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

      const ns = scopedNamespace(scopeId, namespace);
      if (!ns) {
        return fallbackText ?? key;
      }

      return getI18nRuntime().t(key, {
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
        void getI18nRuntime().changeLanguage(trimmed);
        return trimmed;
      },
    };
  };
}
