import type { CatalogProvider } from '../catalog';
import type { Locale, Namespace, PlaceholderValues, TranslationPath } from '../types';
import { analyzeTranslationValue } from './templateAnalyzer';
import { interpolatePlaceholders } from './placeholderInterpolator';
import { getTranslationValue } from './translationValue';
import type { MissingPathInfo, Translator, TranslatorOptions } from './types';

/**
 * Creates a Translator that resolves translation paths using the provided CatalogProvider.
 */
export function createTranslator(
  catalogProvider: CatalogProvider,
  options: TranslatorOptions = {},
): Translator {
  const { defaultNamespace, fallbackLocale, onMissingKey } = options;

  const translate: Translator['translate'] = (locale, namespace, path, params) => {
    const effectiveNamespace = resolveNamespace(namespace, defaultNamespace);

    /**
     * Returns the provided path rendered as a translation string.
     */
    function renderPath(): string {
      return renderValue(path, params);
    }

    if (!effectiveNamespace) {
      return renderPath();
    }

    const resolvedNamespace: Namespace = effectiveNamespace;

    /**
     * Returns the resolved translation value for the given locale and namespace.
     */
    function lookup(localeToUse: Locale): string | null {
      return getTranslationValue(
        catalogProvider,
        localeToUse,
        resolvedNamespace,
        path,
      );
    }

    /**
     * Reports a missing translation for the requested locale.
     */
    function reportMissing(): void {
      if (!onMissingKey) {
        return;
      }
      const info: MissingPathInfo = {
        locale,
        namespace: resolvedNamespace,
        path,
      };
      onMissingKey(info);
    }

    const primary = lookup(locale);
    if (primary !== null) {
      return renderValue(primary, params);
    }

    if (fallbackLocale && fallbackLocale !== locale) {
      const fallback = lookup(fallbackLocale);
      if (fallback !== null) {
        reportMissing();
        return renderValue(fallback, params);
      }
    }

    reportMissing();
    return renderPath();
  };

  return { translate };
}

/**
 * Resolves the effective namespace to use for a translation call.
 */
function resolveNamespace(
  namespace: Namespace | undefined,
  defaultNamespace: Namespace | undefined,
): Namespace | undefined {
  return namespace ?? defaultNamespace;
}

/**
 * Renders a translation value by interpolating placeholders when present.
 */
function renderValue(value: TranslationPath | string, params?: PlaceholderValues): string {
  const template = analyzeTranslationValue(value);
  return template ? interpolatePlaceholders(template, params) : value;
}
