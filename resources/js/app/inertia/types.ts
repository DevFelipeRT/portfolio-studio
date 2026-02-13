import type { ComponentType } from 'react';
import type { PageModuleLoader as AppPageModuleLoader } from '@/app/types';

/**
 * Base shape for the initial Inertia page props.
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

export type InertiaPageComponent = ComponentType<Record<string, unknown>> & {
  layout?: unknown;
  displayName?: string;
};

export type PageModule = {
  default: InertiaPageComponent;
};

export type PageModuleLoader = AppPageModuleLoader;
