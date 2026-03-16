import type { AppLocalizationContext, AppPageProps } from '../types';
import { resolveAppLocalizationContext } from './localizationContext';

/**
 * The cached runtime metadata derived from the current application page props.
 */
type AppRuntimeState = {
  propsCache: AppPageProps;
  localizationContext: AppLocalizationContext;
  titleTemplate: string | null;
  siteName: Record<string, string> | null;
  defaultMetaTitle: Record<string, string> | null;
  ownerName: string | null;
};

/**
 * The module-level runtime snapshot consumed by title and localization policy
 * helpers.
 */
let state: AppRuntimeState = {
  propsCache: {},
  localizationContext: resolveAppLocalizationContext({}),
  titleTemplate: null,
  siteName: null,
  defaultMetaTitle: null,
  ownerName: null,
};

/**
 * The current application runtime snapshot.
 */
export function getAppRuntimeState(): AppRuntimeState {
  return state;
}

/**
 * The runtime-state initializer that derives application metadata from page
 * props.
 */
export function initializeAppRuntimeState(initialProps: AppPageProps): void {
  state = {
    propsCache: initialProps,
    localizationContext: resolveAppLocalizationContext(initialProps),
    titleTemplate: initialProps.websiteSettings?.metaTitleTemplate ?? null,
    siteName: initialProps.websiteSettings?.siteName ?? null,
    defaultMetaTitle: initialProps.websiteSettings?.defaultMetaTitle ?? null,
    ownerName: initialProps.websiteSettings?.ownerName ?? null,
  };
}
