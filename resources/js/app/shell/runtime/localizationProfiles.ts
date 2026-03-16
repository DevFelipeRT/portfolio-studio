import {
  APP_LOCALIZATION_PROFILE_IDS,
  type AppLocalizationProfile,
  type AppLocalizationScope,
  type AppSharedLocalization,
} from '../types';

/**
 * The profile-definition contract used to match shared localization payloads
 * to canonical shell profiles.
 */
type AppLocalizationProfileDefinition = {
  profile: AppLocalizationProfile;
  matches(localization: AppSharedLocalization): boolean;
};

/**
 * The profile factory used by the shell-localization registry.
 */
function profile(id: AppLocalizationScope): AppLocalizationProfile {
  return {
    id,
    isSystem: id === APP_LOCALIZATION_PROFILE_IDS.system,
    isPublic: id === APP_LOCALIZATION_PROFILE_IDS.public,
  };
}

/**
 * The registry of supported localization profiles for the application shell.
 */
export const APP_LOCALIZATION_PROFILES: Record<
  AppLocalizationScope,
  AppLocalizationProfileDefinition
> = {
  [APP_LOCALIZATION_PROFILE_IDS.system]: {
    profile: profile(APP_LOCALIZATION_PROFILE_IDS.system),
    matches(localization) {
      return (
        localization.scope === APP_LOCALIZATION_PROFILE_IDS.system ||
        (localization.persistClientCookie === false &&
          localization.apiEndpoint === '/system/locale')
      );
    },
  },
  [APP_LOCALIZATION_PROFILE_IDS.public]: {
    profile: profile(APP_LOCALIZATION_PROFILE_IDS.public),
    matches(localization) {
      return (
        localization.scope === APP_LOCALIZATION_PROFILE_IDS.public ||
        !APP_LOCALIZATION_PROFILES[APP_LOCALIZATION_PROFILE_IDS.system].matches(
          localization,
        )
      );
    },
  },
};

/**
 * The profile resolver that normalizes shared localization payloads into one
 * of the canonical shell profiles.
 */
export function resolveAppLocalizationProfile(
  localization: AppSharedLocalization,
): AppLocalizationProfile {
  const matchedProfile = Object.values(APP_LOCALIZATION_PROFILES).find(
    ({ matches }) => matches(localization),
  );

  return (
    matchedProfile?.profile ??
    APP_LOCALIZATION_PROFILES[APP_LOCALIZATION_PROFILE_IDS.public].profile
  );
}
