import { getInertiaRuntimeState } from './state';
import { resolveInitialLocale, resolveLocalizedValue } from './locale';

export function inertiaTitle(title: unknown): string {
  const { propsCache, titleTemplate, siteName, defaultMetaTitle, ownerName } =
    getInertiaRuntimeState();

  const locale = resolveInitialLocale(propsCache) ?? '';
  const fallbackLocale = propsCache.localization?.fallbackLocale ?? '';
  const pageTitle = typeof title === 'string' ? title.trim() : '';
  const template = titleTemplate?.trim() || '{page_title}';
  const resolvedSiteName = resolveLocalizedValue(siteName, locale, fallbackLocale);
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

