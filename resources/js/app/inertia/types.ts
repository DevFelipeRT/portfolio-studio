import type { ComponentType, ExoticComponent } from 'react';
import type { PageModuleLoader as AppPageModuleLoader } from '@/app/types';

/**
 * Base shape for the Inertia page props passed from the backend.
 */
export interface InertiaPageProps extends Record<string, unknown> {
  locale?: string;
  localization?: {
    currentLocale?: string;
    supportedLocales?: string[];
    defaultLocale?: string;
    fallbackLocale?: string;
    cookieName?: string;
    apiEndpoint?: string;
    persistClientCookie?: boolean;
  };
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
