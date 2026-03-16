import type { ComponentType, ExoticComponent } from 'react';
import type { PageModuleLoader as AppPageModuleLoader } from '@/app/types';

/**
 * The canonical localization-profile identifiers used by the application
 * shell.
 */
export const APP_LOCALIZATION_PROFILE_IDS = {
  system: 'system',
  public: 'public',
} as const;

/**
 * The supported localization scopes represented by the shell runtime.
 */
export type AppLocalizationScope =
  (typeof APP_LOCALIZATION_PROFILE_IDS)[keyof typeof APP_LOCALIZATION_PROFILE_IDS];

/**
 * The normalized profile metadata attached to a resolved localization scope.
 */
export type AppLocalizationProfile = {
  id: AppLocalizationScope;
  isSystem: boolean;
  isPublic: boolean;
};

/**
 * The localization payload shared from the backend to the frontend runtime.
 */
export type AppSharedLocalization = {
  scope?: AppLocalizationScope;
  currentLocale?: string;
  supportedLocales?: string[];
  defaultLocale?: string;
  fallbackLocale?: string;
  cookieName?: string;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
};

/**
 * The normalized localization context consumed throughout the application
 * shell.
 */
export type AppLocalizationContext = {
  scope: AppLocalizationScope;
  profile: AppLocalizationProfile;
  currentLocale: string | null;
  defaultLocale: string | null;
  fallbackLocale: string | null;
  supportedLocales: string[];
  persistence: {
    cookieName: string | null;
    apiEndpoint: string | null;
    persistClientCookie: boolean;
  };
  raw: AppSharedLocalization;
};

/**
 * The base application page-props shape shared from the backend.
 */
export interface AppPageProps extends Record<string, unknown> {
  locale?: string;
  localization?: AppSharedLocalization;
  websiteSettings?: {
    siteName?: Record<string, string> | null;
    ownerName?: string | null;
    metaTitleTemplate?: string | null;
    defaultMetaTitle?: Record<string, string> | null;
  };
}

/**
 * The React page-component shape used by the application shell after page
 * loading and decoration.
 */
export type AppPageComponent = (
  | ComponentType<Record<string, unknown>>
  | ExoticComponent<Record<string, unknown>>
) & {
  layout?: unknown;
  i18n?: string[];
  getI18nScope?: (props: AppPageProps) => string[] | null | undefined;
  displayName?: string;
};

/**
 * The lazy page module contract consumed by the bootstrap page resolver.
 */
export type PageModule = {
  default: AppPageComponent;
};

/**
 * The page loader contract reused from the app-level page registry types.
 */
export type PageModuleLoader = AppPageModuleLoader;
