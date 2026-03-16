import {
  resolveInitialLocale,
  resolveLocalizedValue,
} from '../page/locale';
import { getAppRuntimeState } from './runtimeState';

/**
 * The document-title resolver derived from the current shell runtime state and
 * optional page-level title input.
 */
export function resolveDocumentTitle(title: unknown): string {
  const { propsCache, titleTemplate, siteName, defaultMetaTitle, ownerName } =
    getAppRuntimeState();

  const locale = resolveInitialLocale(propsCache) ?? '';
  const fallbackLocale = propsCache.localization?.fallbackLocale ?? '';
  const pageTitle = typeof title === 'string' ? title.trim() : '';
  const template = titleTemplate?.trim() || '{page_title}';
  const resolvedSiteName = resolveLocalizedValue(
    siteName,
    locale,
    fallbackLocale,
  );
  const resolvedDefaultMetaTitle = resolveLocalizedValue(
    defaultMetaTitle,
    locale,
    fallbackLocale,
  );

  const effectivePageTitle =
    pageTitle || resolvedDefaultMetaTitle || resolvedSiteName || '';

  const rendered = template
    .replaceAll('{page_title}', effectivePageTitle)
    .replaceAll('{owner}', ownerName ?? '')
    .replaceAll('{site}', resolvedSiteName ?? '')
    .replaceAll('{locale}', locale);

  const cleaned = rendered
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' | ');

  return cleaned || effectivePageTitle;
}
