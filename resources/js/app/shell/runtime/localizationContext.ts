import { usePageProps } from '@/common/page-runtime';
import type { AppLocalizationContext, AppPageProps } from '../types';
import { resolveAppLocalizationProfile } from './localizationProfiles';

/**
 * The scalar normalizer used while constructing the shell localization
 * context.
 */
function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized === '' ? null : normalized;
}

/**
 * The list normalizer used for supported-locale payloads shared from the
 * backend.
 */
function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  value.forEach((entry) => {
    const candidate = normalizeString(entry);
    if (!candidate || seen.has(candidate)) {
      return;
    }

    seen.add(candidate);
    normalized.push(candidate);
  });

  return normalized;
}

/**
 * The canonical localization-context resolver for application page props.
 */
export function resolveAppLocalizationContext(
  props: AppPageProps,
): AppLocalizationContext {
  const localization = props.localization ?? {};
  const profile = resolveAppLocalizationProfile(localization);
  const defaultLocale = normalizeString(localization.defaultLocale);
  const currentLocale =
    normalizeString(props.locale) ??
    normalizeString(localization.currentLocale) ??
    defaultLocale;

  return {
    scope: profile.id,
    profile,
    currentLocale,
    defaultLocale,
    fallbackLocale: normalizeString(localization.fallbackLocale),
    supportedLocales: normalizeStringList(localization.supportedLocales),
    persistence: {
      cookieName: normalizeString(localization.cookieName),
      apiEndpoint: normalizeString(localization.apiEndpoint),
      persistClientCookie: localization.persistClientCookie ?? true,
    },
    raw: localization,
  };
}

/**
 * The system-scope predicate for normalized localization contexts.
 */
export function isSystemLocalizationContext(
  context: AppLocalizationContext,
): boolean {
  return context.profile.isSystem;
}

/**
 * The public-scope predicate for normalized localization contexts.
 */
export function isPublicLocalizationContext(
  context: AppLocalizationContext,
): boolean {
  return context.profile.isPublic;
}

/**
 * The page-bound localization-context hook for React consumers inside the app
 * shell.
 */
export function useAppLocalizationContext(): AppLocalizationContext {
  return resolveAppLocalizationContext(usePageProps<AppPageProps>());
}
