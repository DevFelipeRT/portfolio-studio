'use client';

import { I18N_NAMESPACES } from '@/common/i18n';
import type { Namespace, PlaceholderValues } from '@/common/i18n/types';
import { useGetLocale } from '@/common/locale';
import { useTranslation as useReactI18nextTranslation } from 'react-i18next';
import { scopedNamespace } from '@/common/i18n/i18next/scopedNamespace';

type TranslationFunction = {
  (key: string, params?: PlaceholderValues): string;
  (key: string, fallback: string, params?: PlaceholderValues): string;
};

type UseFormsTranslationResult = {
  locale: string;
  translate: TranslationFunction;
};

/**
 * Like `useTranslation`, but safe to use even when the i18n provider isn't mounted
 * (e.g. in isolated form stories/tests). Falls back to the provided fallback text.
 */
export function useFormsTranslation(
  namespace: Namespace = I18N_NAMESPACES.form,
): UseFormsTranslationResult {
  const locale = useGetLocale();
  const { i18n } = useReactI18nextTranslation();

  const translate: TranslationFunction = (
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
    translate,
  };
}
