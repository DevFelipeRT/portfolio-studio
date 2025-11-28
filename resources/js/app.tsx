import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { I18nProvider, createI18nEnvironment } from './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

type LocalizationSharedProps = {
    locale?: unknown;
    localization?: {
        currentLocale?: unknown;
        supportedLocales?: unknown;
        defaultLocale?: unknown;
        fallbackLocale?: unknown;
    };
};

function resolveInitialLocale(props: unknown): string | null {
    const inertiaProps =
        typeof props === 'object' && props !== null
            ? (props as { initialPage?: { props?: Record<string, unknown> } })
            : null;

    const pageProps = inertiaProps?.initialPage?.props ?? {};

    const locale = (pageProps as LocalizationSharedProps).locale;
    if (typeof locale === 'string' && locale.trim() !== '') {
        return locale;
    }

    const localization = (pageProps as LocalizationSharedProps).localization;
    const currentLocale = localization?.currentLocale;
    if (typeof currentLocale === 'string' && currentLocale.trim() !== '') {
        return currentLocale;
    }

    const defaultLocale = localization?.defaultLocale;
    if (typeof defaultLocale === 'string' && defaultLocale.trim() !== '') {
        return defaultLocale;
    }

    return null;
}

function resolveRuntimeLocalizationConfig(props: unknown): {
    currentLocale: string | null;
    supportedLocales?: unknown;
    defaultLocale?: unknown;
    fallbackLocale?: unknown;
} {
    const inertiaProps =
        typeof props === 'object' && props !== null
            ? (props as { initialPage?: { props?: Record<string, unknown> } })
            : null;

    const pageProps = inertiaProps?.initialPage?.props ?? {};
    const shared = pageProps as LocalizationSharedProps;

    const currentLocale = resolveInitialLocale(props) ?? null;

    const localization = shared.localization ?? {};

    return {
        currentLocale,
        supportedLocales: localization.supportedLocales,
        defaultLocale: localization.defaultLocale,
        fallbackLocale: localization.fallbackLocale,
    };
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const runtimeLocalization = resolveRuntimeLocalizationConfig(props);

        const { localeResolver, translationResolver } = createI18nEnvironment({
            supportedLocales: runtimeLocalization.supportedLocales,
            defaultLocale:
                runtimeLocalization.currentLocale ??
                runtimeLocalization.defaultLocale,
            fallbackLocale: runtimeLocalization.fallbackLocale,
        });

        const app = (
            <I18nProvider
                initialLocale={runtimeLocalization.currentLocale}
                localeResolver={localeResolver}
                translationResolver={translationResolver}
            >
                <App {...props} />
            </I18nProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, app);
            return;
        }

        createRoot(el).render(app);
    },
    progress: {
        color: '#4B5563',
    },
});
