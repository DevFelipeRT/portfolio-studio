import type { Locale, LocaleInput, Namespace } from '../../types';

export type TranslationModuleMeta = {
    locale: Locale;
    namespace: Namespace;
};

/**
 * Parses a module path into locale and namespace metadata.
 */
export function parseTranslationModulePath(
    modulePath: string,
    canonicalizeLocale: (input: LocaleInput) => Locale | null,
): TranslationModuleMeta | null {
    const normalized = modulePath.split('\\').join('/');
    const parts = normalized.split('/');
    const fileName = parts.pop();
    const folderName = parts.pop();

    if (!fileName || !folderName) {
        return null;
    }

    if (!fileName.endsWith('.ts')) {
        return null;
    }

    const namespace = fileName.slice(0, -'.ts'.length).trim();
    const locale = canonicalizeLocale(folderName);

    if (!namespace || !locale) {
        return null;
    }

    return {
        locale,
        namespace: namespace as Namespace,
    };
}

