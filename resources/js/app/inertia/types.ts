import type { ComponentType, ExoticComponent } from 'react';
import type { PageModuleLoader as AppPageModuleLoader } from '@/app/types';

export const INERTIA_LOCALIZATION_PROFILE_IDS = {
  system: 'system',
  public: 'public',
} as const;

export type InertiaLocalizationScope =
  (typeof INERTIA_LOCALIZATION_PROFILE_IDS)[keyof typeof INERTIA_LOCALIZATION_PROFILE_IDS];

export type InertiaLocalizationProfile = {
  id: InertiaLocalizationScope;
  isSystem: boolean;
  isPublic: boolean;
};

export type InertiaSharedLocalization = {
  scope?: InertiaLocalizationScope;
  currentLocale?: string;
  supportedLocales?: string[];
  defaultLocale?: string;
  fallbackLocale?: string;
  cookieName?: string;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
};

export type InertiaLocalizationContext = {
  scope: InertiaLocalizationScope;
  profile: InertiaLocalizationProfile;
  currentLocale: string | null;
  defaultLocale: string | null;
  fallbackLocale: string | null;
  supportedLocales: string[];
  persistence: {
    cookieName: string | null;
    apiEndpoint: string | null;
    persistClientCookie: boolean;
  };
  raw: InertiaSharedLocalization;
};

/**
 * Base shape for the Inertia page props passed from the backend.
 */
export interface InertiaPageProps extends Record<string, unknown> {
  locale?: string;
  localization?: InertiaSharedLocalization;
  websiteSettings?: {
    siteName?: Record<string, string> | null;
    ownerName?: string | null;
    metaTitleTemplate?: string | null;
    defaultMetaTitle?: Record<string, string> | null;
  };
}

export type InertiaPageComponent = (
  | ComponentType<Record<string, unknown>>
  | ExoticComponent<Record<string, unknown>>
) & {
  layout?: unknown;
  /**
   * Optional i18n contributions required by this page (by registry id).
   *
   * Example: ['projects', 'courses'].
   */
  i18n?: string[];
  /**
   * Optional function used to derive i18n contributions from runtime props.
   *
   * This is useful for pages that render dynamic content (e.g. CMS sections)
   * where the required modules depend on the backend payload.
   */
  getI18nScope?: (props: InertiaPageProps) => string[] | null | undefined;
  displayName?: string;
};

export type PageModule = {
  default: InertiaPageComponent;
};

export type PageModuleLoader = AppPageModuleLoader;
