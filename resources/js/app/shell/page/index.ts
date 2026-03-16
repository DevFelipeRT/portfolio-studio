/**
 * Public page-composition helpers for the application shell.
 */
export { decoratePageComponent } from './decoratePageComponent';
export { resolveInitialLocale, resolveLocalizedValue } from './locale';
export { resolveLayoutContent } from './resolveLayoutContent';
export { resolvePageI18nContent } from './resolvePageI18nContent';
export {
  wrapWithShellProviders,
  type WrapWithShellProvidersOptions,
} from './wrapWithShellProviders';
