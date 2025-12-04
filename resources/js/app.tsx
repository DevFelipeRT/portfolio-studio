import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { I18nProvider, createI18nEnvironment } from './i18n';

/**
 * Default application name from environment variables.
 */
const defaultAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Mutable state to store the application owner name for the document title.
 * Updated during the Inertia setup phase.
 */
let currentAppOwner: string | null = null;

/**
 * Structure of the initial page props injected by the backend.
 */
interface InertiaPageProps extends Record<string, unknown> {
    locale?: string;
    localization?: {
        currentLocale?: string;
        supportedLocales?: string[];
        defaultLocale?: string;
        fallbackLocale?: string;
    };
    appOwner?: string;
}

/**
 * Resolves the active locale based on the provided Inertia props hierarchy.
 */
function resolveInitialLocale(props: InertiaPageProps): string | undefined {
    if (props.locale?.trim()) return props.locale;
    if (props.localization?.currentLocale?.trim())
        return props.localization.currentLocale;
    return props.localization?.defaultLocale;
}

createInertiaApp({
    title: (title) => {
        const baseName = currentAppOwner?.trim()
            ? currentAppOwner
            : defaultAppName;
        return title ? `${title} | ${baseName}` : baseName;
    },

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),

    setup({ el, App, props }) {
        const initialProps = props.initialPage.props as InertiaPageProps;

        if (initialProps.appOwner) {
            currentAppOwner = initialProps.appOwner;
        }

        const currentLocale = resolveInitialLocale(initialProps) ?? null;
        const localizationConfig = initialProps.localization || {};

        const { localeResolver, translationResolver } = createI18nEnvironment({
            supportedLocales: localizationConfig.supportedLocales,
            defaultLocale: currentLocale,
            fallbackLocale: localizationConfig.fallbackLocale,
        });

        const root = createRoot(el);

        root.render(
            <I18nProvider
                initialLocale={currentLocale}
                localeResolver={localeResolver}
                translationResolver={translationResolver}
            >
                <App {...props} />
            </I18nProvider>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});
