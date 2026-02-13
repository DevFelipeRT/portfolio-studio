import { CatalogProvider } from './catalogProvider';
import {
    Locale,
    Namespace,
    TranslationNode,
    TranslationParams,
    TranslationTree,
    TranslationValue,
} from './types';

export interface MissingKeyInfo {
    locale: Locale;
    namespace: Namespace;
    key: string;
}

export interface TranslationResolverConfig {
    catalogProvider: CatalogProvider;
    defaultNamespace?: Namespace;
    fallbackLocale?: Locale;
    onMissingKey?(info: MissingKeyInfo): void;
}

/**
 * TranslationResolver resolves translation keys into localized strings.
 */
export interface TranslationResolver {
    translate(
        locale: Locale,
        namespace: Namespace | undefined,
        key: string,
        params?: TranslationParams,
    ): string;
}

/**
 * Creates a TranslationResolver that uses a CatalogProvider and optional fallback strategy.
 */
export function createTranslationResolver(
    config: TranslationResolverConfig,
): TranslationResolver {
    const { catalogProvider, defaultNamespace, fallbackLocale, onMissingKey } =
        config;

    function translate(
        locale: Locale,
        namespace: Namespace | undefined,
        key: string,
        params?: TranslationParams,
    ): string {
        const effectiveNamespace = namespace ?? defaultNamespace;

        // When no namespace is available, gracefully fall back to the key itself.
        // This avoids breaking the application while views are being migrated
        // or before a default namespace is configured.
        if (!effectiveNamespace) {
            return interpolate(key, params);
        }

        const primary = getStringFromCatalog(
            catalogProvider,
            locale,
            effectiveNamespace,
            key,
        );

        if (primary !== null) {
            return interpolate(primary, params);
        }

        if (fallbackLocale && fallbackLocale !== locale) {
            const fallback = getStringFromCatalog(
                catalogProvider,
                fallbackLocale,
                effectiveNamespace,
                key,
            );

            if (fallback !== null) {
                if (onMissingKey) {
                    onMissingKey({
                        locale,
                        namespace: effectiveNamespace,
                        key,
                    });
                }
                return interpolate(fallback, params);
            }
        }

        if (onMissingKey) {
            onMissingKey({ locale, namespace: effectiveNamespace, key });
        }

        return interpolate(key, params);
    }

    return { translate };
}

/**
 * Looks up a translation value inside the catalog for a given locale, namespace and key path.
 */
function getStringFromCatalog(
    catalogProvider: CatalogProvider,
    locale: Locale,
    namespace: Namespace,
    key: string,
): TranslationValue | null {
    const tree = catalogProvider.getCatalog(locale, namespace);
    if (!tree) {
        return null;
    }

    const segments = key.split('.');
    let current: TranslationNode | undefined = tree;

    for (const segment of segments) {
        if (!isTranslationTree(current)) {
            return null;
        }

        current = current[segment];

        if (current === undefined) {
            return null;
        }
    }

    if (typeof current === 'string') {
        return current;
    }

    return null;
}

/**
 * Returns true when the node is a nested translation tree.
 */
function isTranslationTree(
    node: TranslationNode | undefined,
): node is TranslationTree {
    return typeof node === 'object' && node !== null;
}

/**
 * Applies named parameter interpolation to a template string.
 * Uses the format {{name}} for placeholders.
 */
function interpolate(template: string, params?: TranslationParams): string {
    if (!params) {
        return template;
    }

    return template.replace(/{{\s*([\w.-]+)\s*}}/g, (match, paramName) => {
        const value = params[paramName];
        if (value === undefined) {
            return match;
        }
        return String(value);
    });
}
