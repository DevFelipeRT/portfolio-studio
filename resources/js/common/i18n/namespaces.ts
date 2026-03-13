import type { Namespace } from './types';

/**
 * String constants for well-known namespaces used by shared UI.
 *
 * This is a convenience map to avoid scattering raw namespace strings across
 * the codebase (typos, no autocomplete). It does not register/enable namespaces.
 *
 * The actual available namespaces are discovered at runtime by the translation
 * loaders (e.g. files under `./locales/{locale}/{namespace}.ts`).
 */
export const I18N_NAMESPACES = {
    accessibility: 'accessibility' as Namespace,
    actions: 'actions' as Namespace,
    dateTime: 'dateTime' as Namespace,
    dialog: 'dialog' as Namespace,
    feedback: 'feedback' as Namespace,
    form: 'form' as Namespace,
    i18n: 'i18n' as Namespace,
    labels: 'labels' as Namespace,
    languageSelector: 'languageSelector' as Namespace,
    pagination: 'pagination' as Namespace,
    state: 'state' as Namespace,
    table: 'table' as Namespace,
    themeToggle: 'themeToggle' as Namespace,
    validation: 'validation' as Namespace,
} as const;
