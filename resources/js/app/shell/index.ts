/**
 * Public application-shell surface for app runtime policy, page decoration,
 * shell boot helpers, and registry access.
 */
export type {
  AppLocalizationContext,
  AppLocalizationProfile,
  AppLocalizationScope,
  AppPageComponent,
  AppPageProps,
  AppSharedLocalization,
  PageModule,
  PageModuleLoader,
} from './types';
export { APP_LOCALIZATION_PROFILE_IDS } from './types';
export {
  APP_LOCALIZATION_PROFILES,
  getAppRuntimeState,
  initializeAppRuntimeState,
  isPublicLocalizationContext,
  isSystemLocalizationContext,
  resolveAppLocalizationContext,
  resolveAppLocalizationProfile,
  resolveDocumentTitle,
  syncAppRuntimeState,
  useAppLocalizationContext,
} from './runtime';
export {
  decoratePageComponent,
  resolveInitialLocale,
  resolveLayoutContent,
  resolveLocalizedValue,
  resolvePageI18nContent,
  wrapWithShellProviders,
} from './page';
export {
  initializeShell,
  preloadShellBundles,
} from './boot';
export {
  getPageRegistry,
  PageRegistryProvider,
  type PageRegistryManifest,
} from './registry';
