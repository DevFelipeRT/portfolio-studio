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
 * The runtime-state synchronizer that derives application metadata from the
 * current page props snapshot.
 */
export function syncAppRuntimeState(props: AppPageProps): void {
  state = {
    propsCache: props,
    localizationContext: resolveAppLocalizationContext(props),
    titleTemplate: props.websiteSettings?.metaTitleTemplate ?? null,
    siteName: props.websiteSettings?.siteName ?? null,
    defaultMetaTitle: props.websiteSettings?.defaultMetaTitle ?? null,
    ownerName: props.websiteSettings?.ownerName ?? null,
  };
}

/**
 * The runtime-state initializer used during shell boot before the first mount.
 */
export function initializeAppRuntimeState(initialProps: AppPageProps): void {
  syncAppRuntimeState(initialProps);
}
