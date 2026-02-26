'use client';

import { NAMESPACES } from '@/common/i18n/config/namespaces';
import type { Namespace, TranslationParams } from '@/common/i18n/core/types';
import { I18nContext } from '@/common/i18n/react/I18nContext';
import { useContext } from 'react';

type TranslationFunction = {
  (key: string, params?: TranslationParams): string;
  (key: string, fallback: string, params?: TranslationParams): string;
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
  namespace: Namespace = NAMESPACES.common,
): UseFormsTranslationResult {
  const context = useContext(I18nContext);

  const translate: TranslationFunction = (
    key: string,
    secondArgument?: TranslationParams | string,
    thirdArgument?: TranslationParams,
  ): string => {
    let parameters: TranslationParams | undefined;
    let fallbackText: string | undefined;

    if (typeof secondArgument === 'string') {
      fallbackText = secondArgument;
      parameters = thirdArgument;
    } else {
      parameters = secondArgument;
    }

    if (context) {
      const resolved = context.translate(key, parameters, namespace);
      if (fallbackText !== undefined) {
        if (!resolved || resolved === key) {
          return fallbackText;
        }
      }
      return resolved;
    }

    if (fallbackText !== undefined) {
      return fallbackText;
    }

    return key;
  };

  return {
    locale: context?.locale ?? 'en',
    translate,
  };
}

