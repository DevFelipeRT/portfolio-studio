/**
 * Module loader functions for definition modules that register i18n scopes by
 * side effect when imported.
 */
export const definitionLoaders: Array<() => Promise<unknown>> = [
  ...Object.values(import.meta.glob('../../../../modules/*/i18n/definition.ts')),
  ...Object.values(import.meta.glob('../../../../app/layouts/i18n/definition.ts')),
];
