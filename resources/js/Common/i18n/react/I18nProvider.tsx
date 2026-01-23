'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import type { LocaleResolver } from '../core/locale-resolver';
import type { TranslationResolver } from '../core/translation-resolver';
import type { Locale, Namespace, TranslationParams } from '../core/types';
import { I18nContext } from './I18nContext';

type I18nProviderProps = {
    children: ReactNode;
    initialLocale: string | null;
    localeResolver: LocaleResolver;
    translationResolver: TranslationResolver;
};

/**
 * I18nProvider wires the locale resolver and translation resolver
 * into a React context with a stateful locale.
 */
export function I18nProvider({
    children,
    initialLocale,
    localeResolver,
    translationResolver,
}: I18nProviderProps) {
    const resolvedInitial: Locale = localeResolver.resolve(
        initialLocale ?? localeResolver.defaultLocale,
    );

    const [activeLocale, setActiveLocale] = useState<Locale>(resolvedInitial);

    const setLocale = useCallback(
        (nextLocale: string): Locale => {
            const resolved = localeResolver.resolve(nextLocale as Locale);
            setActiveLocale(resolved);
            return resolved;
        },
        [localeResolver],
    );

    const translate = useCallback(
        (key: string, params?: TranslationParams, namespace?: Namespace) => {
            return translationResolver.translate(
                activeLocale,
                namespace,
                key,
                params,
            );
        },
        [activeLocale, translationResolver],
    );

    const contextValue = useMemo(
        () => ({
            locale: activeLocale,
            supportedLocales: localeResolver.supportedLocales,
            setLocale,
            translate,
        }),
        [activeLocale, localeResolver, setLocale, translate],
    );

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}
