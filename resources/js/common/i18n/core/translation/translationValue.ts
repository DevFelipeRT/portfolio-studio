import type { CatalogProvider } from '../catalog';
import type {
  Locale,
  Namespace,
  TranslationNode,
  TranslationNodeKey,
  TranslationPath,
  TranslationTree,
  TranslationValue,
} from '../types';

/**
 * Looks up a translation string inside the catalog for a given locale, namespace and key path.
 */
export function getTranslationValue(
  catalogProvider: CatalogProvider,
  locale: Locale,
  namespace: Namespace,
  path: TranslationPath,
): TranslationValue | null {
  const tree = catalogProvider.getTranslationTree(locale, namespace);
  if (!tree) {
    return null;
  }

  const segments = path.split('.') as TranslationNodeKey[];
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

  return typeof current === 'string' ? current : null;
}

function isTranslationTree(
  node: TranslationNode | undefined,
): node is TranslationTree {
  return typeof node === 'object' && node !== null;
}
