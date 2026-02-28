import type { Namespace } from './namespace';
import type { TranslationTree } from './translation';

/**
 * Catalog represents all translation files for a single locale:
 * a map of namespace (file name) to that file's TranslationTree.
 */
export interface Catalog {
    [namespace: Namespace]: TranslationTree;
}

