'use client';

import { useContext } from 'react';
import type { Locale } from '../../core/types';
import { I18nContext } from '../I18nContext';

/**
 * Retrieves the list of supported locales from the I18n context.
 * This list is derived from the configured LocaleResolver.
 */
export function useSupportedLocales(): readonly Locale[] {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error(
            'useSupportedLocales must be used within an I18nProvider.',
        );
    }

    return context.supportedLocales;
}
