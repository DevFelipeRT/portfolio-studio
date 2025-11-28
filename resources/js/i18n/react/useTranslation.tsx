'use client';

import { useContext } from 'react';
import type { Namespace, TranslationParams } from '../core/types';
import { I18nContext } from './I18nContext';

type TranslationFunction = {
    (key: string, params?: TranslationParams): string;
    (key: string, fallback: string, params?: TranslationParams): string;
};

export interface UseTranslationResult {
    locale: string;
    translate: TranslationFunction;
    setLocale(nextLocale: string): string;
}

/**
 * useTranslation exposes the current locale and a namespaced
 * translation function bound to the I18nProvider context.
 *
 * The translation function supports an optional fallback:
 * - translate('key')
 * - translate('key', params)
 * - translate('key', 'Fallback text')
 * - translate('key', 'Fallback text', params)
 */
export function useTranslation(namespace?: Namespace): UseTranslationResult {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider.');
    }

    const { locale, translate, setLocale } = context;

    const translateWithNamespace: TranslationFunction = (
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

        const resolved = translate(key, parameters, namespace);

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
