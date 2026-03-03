'use client';

import { useContext } from 'react';
import type { Locale } from '../../core/types';
import { I18nContext } from '../I18nContext';

/**
 * Retrieves the currently active locale identifier from the I18n context.
 */
export function useGetLocale(): Locale {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useGetLocale must be used within an I18nProvider.');
    }

    return context.locale;
}
