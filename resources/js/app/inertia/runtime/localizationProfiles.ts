import {
  INERTIA_LOCALIZATION_PROFILE_IDS,
  type InertiaLocalizationProfile,
  type InertiaLocalizationScope,
  type InertiaSharedLocalization,
} from '../types';

type InertiaLocalizationProfileDefinition = {
  profile: InertiaLocalizationProfile;
  matches(localization: InertiaSharedLocalization): boolean;
};

function profile(
  id: InertiaLocalizationScope,
): InertiaLocalizationProfile {
  return {
    id,
    isSystem: id === INERTIA_LOCALIZATION_PROFILE_IDS.system,
    isPublic: id === INERTIA_LOCALIZATION_PROFILE_IDS.public,
  };
}

export const INERTIA_LOCALIZATION_PROFILES: Record<
  InertiaLocalizationScope,
  InertiaLocalizationProfileDefinition
> = {
  [INERTIA_LOCALIZATION_PROFILE_IDS.system]: {
    profile: profile(INERTIA_LOCALIZATION_PROFILE_IDS.system),
    matches(localization) {
      return (
        localization.scope === INERTIA_LOCALIZATION_PROFILE_IDS.system ||
        (localization.persistClientCookie === false &&
          localization.apiEndpoint === '/system/locale')
      );
    },
  },
  [INERTIA_LOCALIZATION_PROFILE_IDS.public]: {
    profile: profile(INERTIA_LOCALIZATION_PROFILE_IDS.public),
    matches(localization) {
      return (
        localization.scope === INERTIA_LOCALIZATION_PROFILE_IDS.public ||
        !INERTIA_LOCALIZATION_PROFILES[
          INERTIA_LOCALIZATION_PROFILE_IDS.system
        ].matches(localization)
      );
    },
  },
};

export function resolveInertiaLocalizationProfile(
  localization: InertiaSharedLocalization,
): InertiaLocalizationProfile {
  const matchedProfile = Object.values(INERTIA_LOCALIZATION_PROFILES).find(
    ({ matches }) => matches(localization),
  );

  return (
    matchedProfile?.profile ??
    INERTIA_LOCALIZATION_PROFILES[
      INERTIA_LOCALIZATION_PROFILE_IDS.public
    ].profile
  );
}
