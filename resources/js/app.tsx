import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { I18nProvider, createI18nEnvironment } from './i18n';

const defaultAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

let currentAppOwner: string | null = null;

/**
 * Base shape for the initial Inertia page props.
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
 * Resolves the initial locale based on the page props hierarchy.
 */
function resolveInitialLocale(props: InertiaPageProps): string | undefined {
    if (props.locale?.trim()) {
        return props.locale;
    }

    if (props.localization?.currentLocale?.trim()) {
        return props.localization.currentLocale;
    }

    return props.localization?.defaultLocale;
}

// Application-level pages: resources/js/Pages/**/*.tsx
const appPageFiles = import.meta.glob('./Pages/**/*.tsx');

// Module-level pages: resources/js/Modules/**/Pages/**/*.tsx
const modulePageFiles = import.meta.glob('./Modules/**/Pages/**/*.tsx');

type PageModuleLoader = () => Promise<unknown>;

/**
 * Registry of all Inertia pages keyed by their logical component name.
 */
const pageRegistry: Record<string, PageModuleLoader> = {};

/**
 * Registers pages from a file map into the global page registry.
 *
 * Example mappings:
 *   "./Pages/Dashboard.tsx"                         → "Dashboard"
 *   "./Pages/Projects/Index.tsx"                    → "Projects/Index"
 *   "./Modules/ContentManagement/Pages/Admin/X.tsx" → "ContentManagement/Pages/Admin/X"
 */
function registerPages(
    files: Record<string, PageModuleLoader>,
    prefix: string,
): void {
    Object.entries(files).forEach(([path, loader]) => {
        if (!path.startsWith(prefix)) {
            return;
        }

        const withoutPrefix = path.slice(prefix.length);
        const withoutExtension = withoutPrefix.replace(/\.tsx$/, '');

        const componentName = withoutExtension;

        pageRegistry[componentName] = loader;
    });
}

registerPages(appPageFiles, './Pages/');
registerPages(modulePageFiles, './Modules/');

createInertiaApp({
    title: (title) => {
        const baseName = currentAppOwner?.trim()
            ? currentAppOwner
            : defaultAppName;

        return title ? `${title} | ${baseName}` : baseName;
    },

    /**
     * Resolves an Inertia component name to a React component using
     * the normalized page registry.
     *
     * Expected backend usage:
     *   Inertia::render('Dashboard', [...]);
     *   Inertia::render('Projects/Index', [...]);
     *   Inertia::render('ContentManagement/Pages/Admin/PageEdit', [...]);
     */
    resolve: async (name) => {
        const loader = pageRegistry[name];

        if (!loader) {
            throw new Error(`Page not found in registry: ${name}`);
        }

        const pageModule: any = await loader();

        if (!pageModule?.default) {
            throw new Error(
                `Resolved module for "${name}" does not have a default export.`,
            );
        }

        return pageModule.default;
    },

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
