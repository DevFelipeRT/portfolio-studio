import { usePage } from '@inertiajs/react';
import type {
  InertiaLocalizationContext,
  InertiaPageProps,
} from '../types';
import { resolveInertiaLocalizationProfile } from './localizationProfiles';

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized === '' ? null : normalized;
}

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

export function resolveInertiaLocalizationContext(
  props: InertiaPageProps,
): InertiaLocalizationContext {
  const localization = props.localization ?? {};
  const profile = resolveInertiaLocalizationProfile(localization);
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

export function isSystemLocalizationContext(
  context: InertiaLocalizationContext,
): boolean {
  return context.profile.isSystem;
}

export function isPublicLocalizationContext(
  context: InertiaLocalizationContext,
): boolean {
  return context.profile.isPublic;
}

export function useInertiaLocalizationContext(): InertiaLocalizationContext {
  return resolveInertiaLocalizationContext(usePage().props as InertiaPageProps);
}
